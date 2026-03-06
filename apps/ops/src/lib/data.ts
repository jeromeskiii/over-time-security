import { PrismaClient } from "@ots/db";
import type { Guard, Shift, Incident, RiskLevel } from "@ots/domain";

const prisma = new PrismaClient();

type ShiftRow = Shift & { guardName: string; siteName: string };
type IncidentRow = Incident & { guardName: string; siteName: string };

export type DataResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getGuards(): Promise<DataResult<Guard[]>> {
  try {
    const guards = await prisma.guard.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: guards };
  } catch (error) {
    console.error("Failed to fetch guards:", error);
    return { success: false, error: "Failed to fetch guards" };
  }
}

export async function getGuardById(id: string): Promise<DataResult<Guard>> {
  try {
    const guard = await prisma.guard.findUnique({ where: { id } });
    if (!guard) {
      return { success: false, error: "Guard not found" };
    }
    return { success: true, data: guard };
  } catch (error) {
    return { success: false, error: "Failed to fetch guard" };
  }
}

export async function getShifts(options?: {
  guardId?: string;
  siteId?: string;
  status?: string;
  limit?: number;
}): Promise<DataResult<ShiftRow[]>> {
  try {
    const shifts = await prisma.shift.findMany({
      where: {
        guardId: options?.guardId,
        siteId: options?.siteId,
        status: options?.status as any,
      },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
      },
      orderBy: { startTime: "desc" },
      take: options?.limit ?? 50,
    });

    const rows: ShiftRow[] = shifts.map((s) => ({
      id: s.id,
      guardId: s.guardId,
      siteId: s.siteId,
      startTime: s.startTime,
      endTime: s.endTime,
      status: s.status,
      riskLevel: s.riskLevel as RiskLevel,
      createdAt: s.createdAt,
      guardName: s.guard.name,
      siteName: s.site.location,
    }));

    return { success: true, data: rows };
  } catch (error) {
    console.error("Failed to fetch shifts:", error);
    return { success: false, error: "Failed to fetch shifts" };
  }
}

export async function getActiveShifts(): Promise<DataResult<ShiftRow[]>> {
  return getShifts({ status: "IN_PROGRESS" });
}

export async function getIncidents(options?: {
  guardId?: string;
  siteId?: string;
  severity?: string;
  limit?: number;
}): Promise<DataResult<IncidentRow[]>> {
  try {
    const incidents = await prisma.incident.findMany({
      where: {
        guardId: options?.guardId,
        siteId: options?.siteId,
        severity: options?.severity as any,
      },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
      },
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 50,
    });

    const rows: IncidentRow[] = incidents.map((i) => ({
      id: i.id,
      guardId: i.guardId,
      siteId: i.siteId,
      shiftId: i.shiftId ?? undefined,
      type: i.type,
      description: i.description,
      severity: i.severity,
      photoKeys: i.photoKeys,
      occurredAt: i.occurredAt,
      createdAt: i.createdAt,
      guardName: i.guard.name,
      siteName: i.site.location,
    }));

    return { success: true, data: rows };
  } catch (error) {
    console.error("Failed to fetch incidents:", error);
    return { success: false, error: "Failed to fetch incidents" };
  }
}

export async function getRecentActivity(options?: {
  limit?: number;
}): Promise<
  DataResult<
    Array<{ id: string; title: string; timestamp: string; type: string; description?: string }>
  >
> {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: options?.limit ?? 20,
    });

    const activity = events.map((e) => ({
      id: e.id,
      title: formatEventTitle(e.type, e.payload as Record<string, unknown>),
      timestamp: formatTimestamp(e.createdAt),
      type: getEventType(e.type),
      description: (e.payload as Record<string, unknown>)?.description as string | undefined,
    }));

    return { success: true, data: activity };
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return { success: false, error: "Failed to fetch activity" };
  }
}

export async function getDashboardStats(): Promise<
  DataResult<{
    activeGuards: number;
    activeShifts: number;
    openIncidents: number;
    atRiskShifts: number;
  }>
> {
  try {
    const [activeGuards, activeShifts, openIncidents, atRiskShifts] = await Promise.all([
      prisma.guard.count({ where: { status: "ACTIVE" } }),
      prisma.shift.count({ where: { status: "IN_PROGRESS" } }),
      prisma.incident.count({
        where: { severity: { in: ["HIGH", "CRITICAL"] } },
      }),
      prisma.shift.count({
        where: { riskLevel: { in: ["AT_RISK", "CRITICAL"] } },
      }),
    ]);

    return {
      success: true,
      data: { activeGuards, activeShifts, openIncidents, atRiskShifts },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        sites: { select: { id: true, location: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: clients };
  } catch (error) {
    return { success: false, error: "Failed to fetch clients" };
  }
}

export async function getSites() {
  try {
    const sites = await prisma.site.findMany({
      include: {
        client: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: sites };
  } catch (error) {
    return { success: false, error: "Failed to fetch sites" };
  }
}

// Helpers
function formatEventTitle(type: string, payload: Record<string, unknown>): string {
  switch (type) {
    case "SHIFT_STARTED":
      return `Shift started — ${payload.guardName ?? "Guard"}`;
    case "SHIFT_ENDED":
      return `Shift completed — ${payload.guardName ?? "Guard"}`;
    case "INCIDENT_CREATED":
      return `Incident reported — ${payload.title ?? "New incident"}`;
    case "PATROL_MISSED_CHECKPOINT":
      return `Patrol missed — ${payload.expectedCheckpoint ?? "checkpoint"}`;
    default:
      return type.replace(/_/g, " ").toLowerCase();
  }
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function getEventType(type: string): "info" | "success" | "warning" | "danger" {
  switch (type) {
    case "INCIDENT_CREATED":
    case "INCIDENT_ESCALATED":
    case "SHIFT_NO_SHOW":
    case "PATROL_MISSED_CHECKPOINT":
      return "danger";
    case "SHIFT_ENDED":
    case "REPORT_GENERATED":
      return "success";
    case "SHIFT_STARTED":
    case "PATROL_CHECKPOINT_SCANNED":
      return "info";
    default:
      return "info";
  }
}
