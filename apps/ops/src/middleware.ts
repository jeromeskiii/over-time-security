import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@ots/auth/jwt";

const publicPaths = [
  "/login",
  "/api/auth/login",
  "/api/auth/session",
  "/api/leads", // Public endpoint for website contact form
  "/api/dispatch", // Public endpoint for website dispatch intake
];

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
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  if (!token) {
    // API requests get 401, page requests redirect to login
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

  if (!session) {
    // Invalid token - clear cookie and redirect
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
  requestHeaders.set("x-user-id", session.user.id);
  requestHeaders.set("x-user-role", session.user.role);
  requestHeaders.set("x-user-name", session.user.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
