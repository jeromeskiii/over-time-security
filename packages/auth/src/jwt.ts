import { SignJWT, jwtVerify, decodeJwt } from "jose";
import type { Session, SessionUser, AuthTokens } from "./types";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const REFRESH_EXPIRES_IN = "30d";

function getSecretKey(): Uint8Array {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export async function createSession(user: SessionUser): Promise<AuthTokens> {
  const secretKey = getSecretKey();
  const now = Math.floor(Date.now() / 1000);

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
    .setExpirationTime(JWT_EXPIRES_IN)
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
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
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

export async function refreshSession(refreshToken: string): Promise<AuthTokens | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(refreshToken, secretKey);

    if (payload.type !== "refresh" || !payload.sub) {
      return null;
    }

    // Return a minimal token - caller should fetch full user data
    const now = Math.floor(Date.now() / 1000);
    const accessToken = await new SignJWT({
      sub: payload.sub,
      type: "refreshed",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(now)
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(secretKey);

    return {
      accessToken,
      expiresIn: 7 * 24 * 60 * 60,
    };
  } catch {
    return null;
  }
}
