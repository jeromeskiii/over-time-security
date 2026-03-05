import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateCheckInPayload } from '@/lib/checkInValidation';

function corsHeaders() {
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shiftId = searchParams.get('shiftId');
    const guardId = searchParams.get('guardId');

    const checkIns = await prisma.checkIn.findMany({
      where: {
        ...(shiftId && { shiftId }),
        ...(guardId && { guardId }),
      },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
      },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json({ checkIns }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch check-ins.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateCheckInPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const { shiftId, guardId, siteId, timestamp, latitude, longitude, notes } = validation.data;

    const checkIn = await prisma.checkIn.create({
      data: {
        shiftId,
        guardId,
        siteId,
        timestamp: new Date(timestamp),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(notes && { notes }),
      },
    });

    // Auto-update shift status to IN_PROGRESS on first check-in
    await prisma.shift.updateMany({
      where: { id: shiftId, status: 'SCHEDULED' },
      data: { status: 'IN_PROGRESS' },
    });

    return NextResponse.json({ success: true, checkIn }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create check-in.' }, { status: 500, headers: corsHeaders() });
  }
}
