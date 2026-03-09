import { NextRequest, NextResponse } from "next/server";
import { getGuards, getGuardById } from "@/lib/data";
import { getSession, unauthorized, checkPermission } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  const deny = checkPermission(session, "guards:read");
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const result = await getGuardById(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json(result.data);
  }

  const result = await getGuards();
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
