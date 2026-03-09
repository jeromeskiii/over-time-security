import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ots/db";
import { patrolLogValidator } from "@ots/domain/validators";
import { processPatrolScan, createEventBus } from "@ots/automation";
import { verifySession } from "@ots/auth";

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
    const result = patrolLogValidator.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const data = result.data;

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

    const eventBus = createEventBus();
    await processPatrolScan(eventBus, {
      shiftId: data.shiftId,
      guardId,
      siteId: data.siteId,
      checkpoint: data.checkpoint,
      patrolLogId: patrolLog.id,
    });

    return NextResponse.json({
      success: true,
      patrolLog: { id: patrolLog.id, timestamp: patrolLog.timestamp },
    });
  } catch (error) {
    console.error("Patrol scan error:", error);
    return NextResponse.json(
      { error: "Failed to record patrol scan" },
      { status: 500 }
    );
  }
}

