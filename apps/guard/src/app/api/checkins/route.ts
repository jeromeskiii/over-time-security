import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@ots/db";
import { z } from "zod";
import { processGuardCheckIn, createEventBus } from "@ots/automation";

const prisma = new PrismaClient();

const checkInSchema = z.object({
  guardId: z.string(),
  shiftId: z.string(),
  siteId: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
  checkInType: z.enum(["CLOCK_IN", "CLOCK_OUT"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkInSchema.parse(body);

    // Create check-in record
    const checkIn = await prisma.checkIn.create({
      data: {
        shiftId: data.shiftId,
        siteId: data.siteId,
        latitude: data.latitude,
        longitude: data.longitude,
        notes: data.notes,
        timestamp: new Date(),
      },
    });

    // Update shift status if clocking in
    if (data.checkInType === "CLOCK_IN") {
      await prisma.shift.update({
        where: { id: data.shiftId },
        data: { status: "IN_PROGRESS" },
      });
    }

    // Emit event for automation
    const eventBus = createEventBus();
    await processGuardCheckIn(eventBus, {
      shiftId: data.shiftId,
      guardId: data.guardId,
      siteId: data.siteId,
      latitude: data.latitude,
      longitude: data.longitude,
      checkInType: data.checkInType,
    });

    return NextResponse.json({
      success: true,
      checkIn: { id: checkIn.id, timestamp: checkIn.timestamp },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Failed to record check-in" },
      { status: 500 }
    );
  }
}
