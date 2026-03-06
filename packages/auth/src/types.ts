import type { UserRole } from "@ots/domain";

export interface SessionUser {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  guardId?: string;
}

export interface Session {
  user: SessionUser;
  expiresAt: Date;
  iat: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  phone?: string;
  pin?: string;
  otp?: string;
}

export interface AuthResult {
  success: boolean;
  session?: Session;
  tokens?: AuthTokens;
  error?: string;
  requiresOtp?: boolean;
  requiresPin?: boolean;
}
