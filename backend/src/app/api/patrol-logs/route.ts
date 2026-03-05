import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePatrolLogPayload } from '@/lib/patrolLogValidation';

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

    const patrolLogs = await prisma.patrolLog.findMany({
      where: {
        ...(shiftId && { shiftId }),
        ...(guardId && { guardId }),
      },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
      },
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json({ patrolLogs }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch patrol logs.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validatePatrolLogPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const { shiftId, guardId, siteId, checkpointName, timestamp, latitude, longitude, notes } =
      validation.data;

    const patrolLog = await prisma.patrolLog.create({
      data: {
        shiftId,
        guardId,
        siteId,
        checkpointName,
        timestamp: new Date(timestamp),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(notes && { notes }),
      },
    });

    return NextResponse.json({ success: true, patrolLog }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create patrol log.' }, { status: 500, headers: corsHeaders() });
  }
}
