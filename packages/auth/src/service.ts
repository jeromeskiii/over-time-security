import { prisma, ActorType } from "@ots/db";
import { hash, compare } from "bcryptjs";
import { createHash } from "crypto";
import type { SessionUser, LoginCredentials, AuthResult } from "./types";
import { createSession } from "./jwt";
import type { UserRole } from "@ots/domain";

const PIN_SALT_ROUNDS = 10;
const OTP_TTL_MINUTES = 5;

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
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  const otpHash = hashOtp(otp);

  // Remove any existing unexpired token for this phone
  await prisma.verificationToken.deleteMany({ where: { phone } });

  await prisma.verificationToken.create({
    data: { phone, otpHash, expiresAt },
  });
}

function formatTwilioPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  throw new Error("Guard phone number must be a valid US number for OTP delivery");
}

async function sendOtpSms(phone: string, otp: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV ONLY] OTP for ${phone}: ${otp}`);
      return;
    }

    throw new Error(
      "OTP delivery is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER."
    );
  }

  const twilioModule = await import("twilio");
  const client = twilioModule.default(accountSid, authToken);

  await client.messages.create({
    to: formatTwilioPhoneNumber(phone),
    from: fromNumber,
    body: `Your Over Time Security verification code is ${otp}. It expires in ${OTP_TTL_MINUTES} minutes.`,
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
  await sendOtpSms(normalizedPhone, otp);

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
    return {
      success: false,
      error: "PIN setup incomplete. Contact your supervisor before signing in.",
    };
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
