import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, createSessionToken, type UserRole } from '@/lib/auth';

type LoginPayload = {
  role?: string;
  password?: string;
};

const rolePasswordEnv: Record<UserRole, string> = {
  admin: 'ADMIN_ACCESS_PASSWORD',
  guard: 'GUARD_ACCESS_PASSWORD',
};

const roleTtlSeconds: Record<UserRole, number> = {
  admin: 60 * 60 * 8,
  guard: 60 * 60 * 12,
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LoginPayload;
    if (!payload.role || !payload.password) {
      return NextResponse.json({ error: 'role and password are required.' }, { status: 400 });
    }

    if (payload.role !== 'admin' && payload.role !== 'guard') {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }

    const cookieSecret = process.env.AUTH_COOKIE_SECRET;
    const expectedPassword = process.env[rolePasswordEnv[payload.role]];
    if (!cookieSecret || !expectedPassword) {
      return NextResponse.json({ error: 'Auth environment is not configured.' }, { status: 503 });
    }

    if (payload.password !== expectedPassword) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const ttlSeconds = roleTtlSeconds[payload.role];
    const sessionToken = await createSessionToken(payload.role, cookieSecret, ttlSeconds);

    const response = NextResponse.json({ success: true, role: payload.role }, { status: 200 });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ttlSeconds,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to authenticate.' }, { status: 500 });
  }
}
