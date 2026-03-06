import { NextRequest, NextResponse } from "next/server";
import { getShifts } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const guardId = searchParams.get("guardId") ?? undefined;
  const siteId = searchParams.get("siteId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

  const result = await getShifts({ guardId, siteId, status, limit });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
