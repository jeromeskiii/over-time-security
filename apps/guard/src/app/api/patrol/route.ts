import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@ots/db";
import { z } from "zod";
import { processPatrolScan, createEventBus } from "@ots/automation";

const prisma = new PrismaClient();

const patrolScanSchema = z.object({
  guardId: z.string(),
  shiftId: z.string(),
  siteId: z.string(),
  checkpoint: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = patrolScanSchema.parse(body);

    // Create patrol log
    const patrolLog = await prisma.patrolLog.create({
      data: {
        shiftId: data.shiftId,
        siteId: data.siteId,
        checkpointName: data.checkpoint,
        latitude: data.latitude,
        longitude: data.longitude,
        notes: data.notes,
        timestamp: new Date(),
      },
    });

    // Emit event for automation
    const eventBus = createEventBus();
    await processPatrolScan(eventBus, {
      shiftId: data.shiftId,
      guardId: data.guardId,
      siteId: data.siteId,
      checkpoint: data.checkpoint,
      patrolLogId: patrolLog.id,
    });

    return NextResponse.json({
      success: true,
      patrolLog: { id: patrolLog.id, timestamp: patrolLog.timestamp },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Patrol scan error:", error);
    return NextResponse.json(
      { error: "Failed to record patrol scan" },
      { status: 500 }
    );
  }
}
