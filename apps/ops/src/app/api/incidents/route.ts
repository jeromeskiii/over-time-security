import { NextRequest, NextResponse } from "next/server";
import { getIncidents } from "@/lib/data";
import { getSession, unauthorized, checkPermission } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  const deny = checkPermission(session, "incidents:read");
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const guardId = searchParams.get("guardId") ?? undefined;
  const siteId = searchParams.get("siteId") ?? undefined;
  const severity = searchParams.get("severity") ?? undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  const result = await getIncidents({ guardId, siteId, severity, limit });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
