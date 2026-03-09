import { SignJWT, jwtVerify, decodeJwt } from "jose";
import type { Session, SessionUser, AuthTokens } from "./types";

// Guard tokens are short-lived: one shift (~12 h).
// Ops tokens cover a standard workday (~8 h).
const ACCESS_EXPIRES: Record<string, string> = {
  guard: "12h",
  admin: "8h",
  supervisor: "8h",
  client: "8h",
};
const ACCESS_EXPIRES_SECONDS: Record<string, number> = {
  guard: 12 * 60 * 60,
  admin: 8 * 60 * 60,
  supervisor: 8 * 60 * 60,
  client: 8 * 60 * 60,
};
const REFRESH_EXPIRES_IN = "30d";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser): Promise<AuthTokens> {
  const secretKey = getSecretKey();
  const now = Math.floor(Date.now() / 1000);
  const expiresLabel = ACCESS_EXPIRES[user.role] ?? "8h";
  const expiresInSeconds = ACCESS_EXPIRES_SECONDS[user.role] ?? 8 * 60 * 60;

  const accessToken = await new SignJWT({
    sub: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
    guardId: user.guardId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(expiresLabel)
    .sign(secretKey);

  const refreshToken = await new SignJWT({
    sub: user.id,
    type: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(REFRESH_EXPIRES_IN)
    .sign(secretKey);

  return {
    accessToken,
    refreshToken,
    expiresIn: expiresInSeconds,
  };
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);

    if (!payload.sub || !payload.role) {
      return null;
    }

    return {
      user: {
        id: payload.sub as string,
        email: payload.email as string | undefined,
        phone: payload.phone as string | undefined,
        name: payload.name as string,
        role: payload.role as SessionUser["role"],
        guardId: payload.guardId as string | undefined,
      },
      expiresAt: new Date((payload.exp as number) * 1000),
      iat: payload.iat as number,
    };
  } catch {
    return null;
  }
}

export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
}

// refreshSession intentionally returns null until a proper token-rotation
// flow with user-lookup is implemented. Callers should re-authenticate.
export async function refreshSession(_refreshToken: string): Promise<AuthTokens | null> {
  return null;
}
