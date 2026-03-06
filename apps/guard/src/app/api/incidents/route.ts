import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, IncidentSeverity, IncidentType } from "@ots/db";
import { z } from "zod";
import { processNewIncident, createEventBus } from "@ots/automation";

const prisma = new PrismaClient();

const createIncidentSchema = z.object({
  guardId: z.string(),
  siteId: z.string(),
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
  try {
    const body = await request.json();
    const data = createIncidentSchema.parse(body);

    // Create incident in database
    const incident = await prisma.incident.create({
      data: {
        guardId: data.guardId,
        siteId: data.siteId,
        shiftId: data.shiftId,
        type: data.type as IncidentType,
        description: data.description,
        severity: data.severity as IncidentSeverity,
        photoKeys: data.photoKeys ?? [],
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
      },
    });

    // Emit event for automation
    const eventBus = createEventBus();
    await processNewIncident(eventBus, {
      incidentId: incident.id,
      shiftId: data.shiftId ?? "",
      guardId: data.guardId,
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
        { error: error.errors[0].message },
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
