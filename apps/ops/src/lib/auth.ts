import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySession } from "@ots/auth";
import { hasPermission } from "@ots/domain";
import type { Session } from "@ots/auth";
import type { Permission } from "@ots/domain";

export async function getSession(request: NextRequest): Promise<Session | null> {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;
  return verifySession(token);
}

export function unauthorized(): NextResponse {
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 }
  );
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function checkPermission(
  session: Session,
  permission: Permission
): NextResponse | null {
  if (!hasPermission(session.user.role, permission)) {
    return forbidden();
  }
  return null;
}
