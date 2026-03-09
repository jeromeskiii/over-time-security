import { prisma, ActorType } from "@ots/db";
import { hash, compare } from "bcryptjs";
import { createHash } from "crypto";
import type { SessionUser, LoginCredentials, AuthResult } from "./types";
import { createSession } from "./jwt";
import type { UserRole } from "@ots/domain";

const PIN_SALT_ROUNDS = 10;

export async function hashPin(pin: string): Promise<string> {
  return hash(pin, PIN_SALT_ROUNDS);
}

export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  return compare(pin, storedHash);
}

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export async function storeOtp(phone: string, otp: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  const otpHash = hashOtp(otp);

  // Remove any existing unexpired token for this phone
  await prisma.verificationToken.deleteMany({ where: { phone } });

  await prisma.verificationToken.create({
    data: { phone, otpHash, expiresAt },
  });
}

export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  const record = await prisma.verificationToken.findFirst({
    where: { phone, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;

  const valid = record.otpHash === hashOtp(otp);

  // Always delete after one attempt (success or fail) to prevent brute-force
  await prisma.verificationToken.delete({ where: { id: record.id } });

  return valid;
}

// Ops Portal Login (Email + Password)
export async function loginOpsUser(
  email: string,
  password: string
): Promise<AuthResult> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const user: SessionUser = {
      id: "admin-1",
      email,
      name: "Administrator",
      role: "admin" as UserRole,
    };
    const tokens = await createSession(user);
    return {
      success: true,
      session: {
        user,
        expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
        iat: Math.floor(Date.now() / 1000),
      },
      tokens,
    };
  }

  return {
    success: false,
    error: "Invalid email or password",
  };
}

// Guard App Login (Phone + OTP + PIN)
export async function initiateGuardLogin(phone: string): Promise<AuthResult> {
  const normalizedPhone = phone.replace(/\D/g, "");

  const guard = await prisma.guard.findFirst({
    where: { phone: normalizedPhone },
  });

  if (!guard) {
    return {
      success: false,
      error: "No account found with this phone number",
    };
  }

  const otp = generateOtp();
  await storeOtp(normalizedPhone, otp);

  // TODO: Send OTP via SMS (Twilio). Remove this log before production.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV ONLY] OTP for ${normalizedPhone}: ${otp}`);
  }

  return {
    success: true,
    requiresOtp: true,
  };
}

export async function verifyGuardOtp(
  phone: string,
  otp: string
): Promise<AuthResult> {
  const normalizedPhone = phone.replace(/\D/g, "");

  if (!(await verifyOtp(normalizedPhone, otp))) {
    return {
      success: false,
      error: "Invalid or expired code",
    };
  }

  return {
    success: true,
    requiresPin: true,
  };
}

export async function verifyGuardPin(
  phone: string,
  pin: string
): Promise<AuthResult> {
  const normalizedPhone = phone.replace(/\D/g, "");

  const guard = await prisma.guard.findFirst({
    where: { phone: normalizedPhone },
  });

  if (!guard) {
    return { success: false, error: "Account not found" };
  }

  if (guard.status !== "ACTIVE") {
    return {
      success: false,
      error: "Account is not active. Contact your supervisor.",
    };
  }

  if (guard.pinHash) {
    const validPin = await verifyPin(pin, guard.pinHash);
    if (!validPin) {
      return { success: false, error: "Invalid PIN" };
    }
  } else {
    // PIN not yet configured — log a warning but allow login during migration.
    // TODO: enforce pinHash presence once admin PIN-setup flow is built.
    console.warn(
      `[AUTH] Guard ${guard.id} has no pinHash — PIN verification skipped (migration mode)`
    );
  }

  const user: SessionUser = {
    id: `guard-${guard.id}`,
    phone: guard.phone,
    name: guard.name,
    role: "guard" as UserRole,
    guardId: guard.id,
  };

  const tokens = await createSession(user);

  await prisma.event.create({
    data: {
      type: "GUARD_CHECKED_IN",
      entityType: "guard",
      entityId: guard.id,
      actorId: guard.id,
      actorType: ActorType.GUARD,
      payload: { action: "login" },
    },
  });

  return {
    success: true,
    session: {
      user,
      expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      iat: Math.floor(Date.now() / 1000),
    },
    tokens,
  };
}

export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  if (credentials.email && credentials.password) {
    return loginOpsUser(credentials.email, credentials.password);
  }

  if (credentials.phone && credentials.pin && !credentials.otp) {
    return verifyGuardPin(credentials.phone, credentials.pin);
  }

  return {
    success: false,
    error: "Invalid credentials provided",
  };
}
