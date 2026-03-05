import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

type AccessLevel = 'public' | 'admin' | 'guard_or_admin';

function isApiPath(pathname: string): boolean {
  return pathname.startsWith('/api');
}

function requiredAccess(pathname: string, method: string): AccessLevel {
  if (pathname === '/api/auth/login' || pathname === '/api/auth/logout') {
    return 'public';
  }

  if (pathname === '/api/leads' && (method === 'POST' || method === 'OPTIONS')) {
    return 'public';
  }

  if (pathname.startsWith('/dashboard')) {
    return 'admin';
  }

  if (pathname.startsWith('/guard')) {
    return 'guard_or_admin';
  }

  if (pathname.startsWith('/api/shifts')) return 'guard_or_admin';
  if (pathname.startsWith('/api/check-ins')) return 'guard_or_admin';
  if (pathname.startsWith('/api/patrol-logs')) return 'guard_or_admin';
  if (pathname.startsWith('/api/incidents')) return 'guard_or_admin';
  if (pathname.startsWith('/api/upload/presign')) return 'guard_or_admin';

  if (pathname.startsWith('/api')) {
    return 'admin';
  }

  return 'public';
}

function unauthorizedResponse(pathname: string, next: URL) {
  if (isApiPath(pathname)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = next;
  loginUrl.pathname = pathname.startsWith('/dashboard') ? '/login/admin' : '/login/guard';
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

function forbiddenResponse(pathname: string, next: URL) {
  if (isApiPath(pathname)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const loginUrl = next;
  loginUrl.pathname = pathname.startsWith('/dashboard') ? '/login/admin' : '/login/guard';
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access = requiredAccess(pathname, request.method);

  if (access === 'public') {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret) {
    if (isApiPath(pathname)) {
      return NextResponse.json({ error: 'Server auth configuration is missing.' }, { status: 503 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return unauthorizedResponse(pathname, request.nextUrl.clone());
  }

  const session = await verifySessionToken(sessionToken, secret);
  if (!session) {
    return unauthorizedResponse(pathname, request.nextUrl.clone());
  }

  if (access === 'admin' && session.role !== 'admin') {
    return forbiddenResponse(pathname, request.nextUrl.clone());
  }

  if (access === 'guard_or_admin' && session.role !== 'admin' && session.role !== 'guard') {
    return forbiddenResponse(pathname, request.nextUrl.clone());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*', '/guard/:path*'],
};
