import { NextRequest, NextResponse } from "next/server";
import { prisma, IncidentSeverity, IncidentType } from "@ots/db";
import { z } from "zod";
import { processNewIncident, createEventBus } from "@ots/automation";
import { verifySession } from "@ots/auth";

const createIncidentSchema = z.object({
  siteId: z.string().min(1),
  shiftId: z.string().optional(),
  type: z.enum([
    "THEFT",
    "VANDALISM",
    "TRESPASS",
    "MEDICAL",
    "FIRE",
    "SUSPICIOUS_ACTIVITY",
    "OTHER",
  ]),
  description: z.string().min(10),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  photoKeys: z.array(z.string()).optional(),
  occurredAt: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Derive identity from verified session — never trust client-supplied guardId
  const token = request.cookies.get("session")?.value;
  const session = token ? await verifySession(token) : null;

  if (!session?.user.guardId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const guardId = session.user.guardId;

  try {
    const body = await request.json();
    const data = createIncidentSchema.parse(body);

    // If a shiftId is provided, verify it belongs to this guard
    if (data.shiftId) {
      const shift = await prisma.shift.findUnique({
        where: { id: data.shiftId },
        select: { guardId: true },
      });

      if (!shift || shift.guardId !== guardId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const incident = await prisma.incident.create({
      data: {
        guardId,
        siteId: data.siteId,
        shiftId: data.shiftId,
        type: data.type as IncidentType,
        description: data.description,
        severity: data.severity as IncidentSeverity,
        photoKeys: data.photoKeys ?? [],
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
      },
    });

    const eventBus = createEventBus();
    await processNewIncident(eventBus, {
      incidentId: incident.id,
      shiftId: data.shiftId ?? "",
      guardId,
      siteId: data.siteId,
      severity: data.severity,
      type: data.type,
      title: data.description.slice(0, 100),
    });

    return NextResponse.json({
      success: true,
      incident: { id: incident.id, createdAt: incident.createdAt },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }
    console.error("Create incident error:", error);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}
