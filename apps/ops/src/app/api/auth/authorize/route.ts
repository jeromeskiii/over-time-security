import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@ots/auth";
import { hasPermission, type Permission } from "@ots/domain";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json(
      { authorized: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json(
      { authorized: false, error: "Invalid session" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { permission } = body as { permission: Permission };

    if (!permission) {
      return NextResponse.json(
        { authorized: false, error: "Permission required" },
        { status: 400 }
      );
    }

    const authorized = hasPermission(session.user.role, permission);

    return NextResponse.json({
      authorized,
      role: session.user.role,
      permission,
    });
  } catch {
    return NextResponse.json(
      { authorized: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
