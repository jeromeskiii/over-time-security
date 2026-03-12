import { NextRequest, NextResponse } from "next/server";
import { getReports, updateReportStatus } from "@/lib/data";
import { getSession, unauthorized, checkPermission } from "@/lib/auth";
import { reportQuerySchema, reportStatusUpdateSchema } from "@ots/domain/validators";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  const deny = checkPermission(session, "reports:read");
  if (deny) return deny;

  const { searchParams } = new URL(request.url);
  const result = reportQuerySchema.safeParse({
    status: searchParams.get("status") ?? undefined,
    siteId: searchParams.get("siteId") ?? undefined,
    incidentId: searchParams.get("incidentId") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 400 }
    );
  }

  const { status, siteId, incidentId, limit } = result.data;
  const dataResult = await getReports({ status, siteId, incidentId, limit });

  if (!dataResult.success) {
    return NextResponse.json({ error: dataResult.error }, { status: 500 });
  }

  return NextResponse.json(dataResult.data);
}

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  const deny = checkPermission(session, "reports:write");
  if (deny) return deny;

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Report ID required" }, { status: 400 });
  }

  const result = reportStatusUpdateSchema.safeParse(updateData);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 400 }
    );
  }

  if (result.data.status === "SENT" && !result.data.sentTo) {
    return NextResponse.json(
      { error: "Email address required when sending report" },
      { status: 400 }
    );
  }

  const dataResult = await updateReportStatus(id, {
    status: result.data.status,
    sentTo: result.data.sentTo,
  });

  if (!dataResult.success) {
    return NextResponse.json({ error: dataResult.error }, { status: 500 });
  }

  return NextResponse.json(dataResult.data);
}
