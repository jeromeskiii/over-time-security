import { PrismaClient, ActorType } from "@ots/db";
import { hash, compare } from "bcryptjs";
import type { SessionUser, LoginCredentials, AuthResult } from "./types";
import { createSession } from "./jwt";
import type { UserRole } from "@ots/domain";

const prisma = new PrismaClient();

// OTP storage (in production, use Redis with TTL)
const otpStore = new Map<string, { otp: string; expiresAt: Date }>();
const PIN_SALT_ROUNDS = 10;

export async function hashPin(pin: string): Promise<string> {
  return hash(pin, PIN_SALT_ROUNDS);
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return compare(pin, hash);
}

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function storeOtp(phone: string, otp: string): void {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  otpStore.set(phone, { otp, expiresAt });
}

export function verifyOtp(phone: string, otp: string): boolean {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  if (stored.expiresAt < new Date()) {
    otpStore.delete(phone);
    return false;
  }
  if (stored.otp !== otp) return false;
  otpStore.delete(phone);
  return true;
}

// Ops Portal Login (Email + Password)
export async function loginOpsUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // In production, look up user from database with password hash
  // For now, we use environment-based admin credentials
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
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        iat: Math.floor(Date.now() / 1000),
      },
      tokens,
    };
  }

  // Check for supervisor users in database
  // Note: You'd need a User table with password hashes in production
  return {
    success: false,
    error: "Invalid email or password",
  };
}

// Guard App Login (Phone + OTP + PIN)
export async function initiateGuardLogin(phone: string): Promise<AuthResult> {
  // Normalize phone number
  const normalizedPhone = phone.replace(/\D/g, "");

  // Look up guard by phone
  const guard = await prisma.guard.findFirst({
    where: { phone: normalizedPhone },
  });

  if (!guard) {
    return {
      success: false,
      error: "No account found with this phone number",
    };
  }

  // Generate and store OTP
  const otp = generateOtp();
  storeOtp(normalizedPhone, otp);

  // In production, send OTP via SMS
  console.log(`[DEV] OTP for ${normalizedPhone}: ${otp}`);

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

  if (!verifyOtp(normalizedPhone, otp)) {
    return {
      success: false,
      error: "Invalid or expired code",
    };
  }

  // OTP verified, now require PIN
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
    return {
      success: false,
      error: "Account not found",
    };
  }

  // In production, verify PIN hash from database
  // For now, accept any 4-digit PIN for active guards
  if (guard.status !== "ACTIVE") {
    return {
      success: false,
      error: "Account is not active. Contact your supervisor.",
    };
  }

  // TODO: Add pinHash field to Guard model and verify:
  // const validPin = await verifyPin(pin, guard.pinHash);
  // if (!validPin) { ... }

  const user: SessionUser = {
    id: `guard-${guard.id}`,
    phone: guard.phone,
    name: guard.name,
    role: "guard" as UserRole,
    guardId: guard.id,
  };

  const tokens = await createSession(user);

  // Emit login event for audit
  await prisma.event.create({
    data: {
      type: "GUARD_CHECKED_IN",
      entityType: "guard",
      entityId: guard.id,
      actorId: guard.id,
      actorType: ActorType.GUARD,
      payload: { action: "login", phone: normalizedPhone },
    },
  });

  return {
    success: true,
    session: {
      user,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      iat: Math.floor(Date.now() / 1000),
    },
    tokens,
  };
}

// Unified login dispatcher
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
