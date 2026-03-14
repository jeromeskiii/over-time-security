import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@ots/auth/jwt";

const publicPaths = ["/login", "/api/auth/login", "/api/auth/session"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/manifest")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySession(token);

  if (!session || !session.user.guardId) {
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Invalid session" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));

    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  // Attach session info to request headers for API routes (internal only, not sent to client)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-guard-id", session.user.guardId);
  requestHeaders.set("x-user-id", session.user.id);
  requestHeaders.set("x-user-name", session.user.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
