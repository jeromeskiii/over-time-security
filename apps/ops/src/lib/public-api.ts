import { NextRequest, NextResponse } from "next/server";

const EXPLICIT_ALLOWED_ORIGINS = [
  process.env.WEB_APP_URL,
  "https://overtimesecurity.com",
  "https://www.overtimesecurity.com",
].filter((origin): origin is string => Boolean(origin));

function isLocalWebOrigin(url: URL): boolean {
  return (
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
    url.port === "3000"
  );
}

function isAllowedOrigin(origin: string): boolean {
  if (EXPLICIT_ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }

  if (isLocalWebOrigin(url)) {
    return true;
  }

  return url.protocol === "https:" && url.hostname.endsWith(".vercel.app");
}

export function buildPublicCorsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };

  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export function rejectDisallowedOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");

  if (!origin || isAllowedOrigin(origin)) {
    return null;
  }

  return NextResponse.json(
    { error: "Origin not allowed" },
    { status: 403, headers: buildPublicCorsHeaders(origin) }
  );
}
