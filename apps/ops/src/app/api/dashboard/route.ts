import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats, getRecentActivity, getActiveShifts, getIncidents } from "@/lib/data";
import { getSession, unauthorized, checkPermission } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return unauthorized();
  const deny = checkPermission(session, "reports:read");
  if (deny) return deny;

  const [stats, activity, shifts, incidents] = await Promise.all([
    getDashboardStats(),
    getRecentActivity({ limit: 10 }),
    getActiveShifts(),
    getIncidents({ limit: 5 }),
  ]);

  if (!stats.success) {
    return NextResponse.json({ error: stats.error }, { status: 500 });
  }

  return NextResponse.json({
    stats: stats.data,
    activity: activity.success ? activity.data : [],
    activeShifts: shifts.success ? shifts.data : [],
    recentIncidents: incidents.success ? incidents.data : [],
  });
}
