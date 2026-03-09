import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ots/db";
import { z } from "zod";
import { processGuardCheckIn, createEventBus } from "@ots/automation";
import { verifySession } from "@ots/auth";

const checkInSchema = z.object({
  shiftId: z.string().min(1),
  siteId: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional(),
  checkInType: z.enum(["CLOCK_IN", "CLOCK_OUT"]),
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
    const data = checkInSchema.parse(body);

    // Verify the shift belongs to this guard
    const shift = await prisma.shift.findUnique({
      where: { id: data.shiftId },
      select: { id: true, guardId: true },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    if (shift.guardId !== guardId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    if (data.checkInType === "CLOCK_IN") {
      await prisma.shift.update({
        where: { id: data.shiftId },
        data: { status: "IN_PROGRESS" },
      });
    }

    const eventBus = createEventBus();
    await processGuardCheckIn(eventBus, {
      shiftId: data.shiftId,
      guardId,
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
        { error: error.issues[0]?.message ?? "Invalid request" },
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
