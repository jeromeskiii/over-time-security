import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateShiftPayload } from '@/lib/shiftValidation';
import { ShiftStatus } from '@prisma/client';

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
    const guardId = searchParams.get('guardId');
    const siteId = searchParams.get('siteId');
    const status = searchParams.get('status');

    const shifts = await prisma.shift.findMany({
      where: {
        ...(guardId && { guardId }),
        ...(siteId && { siteId }),
        ...(status && { status: status.toUpperCase() as ShiftStatus }),
      },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
      },
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json({ shifts }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shifts.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateShiftPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const { guardId, siteId, startTime, endTime, status } = validation.data;

    const shift = await prisma.shift.create({
      data: {
        guardId,
        siteId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ success: true, shift }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create shift.' }, { status: 500, headers: corsHeaders() });
  }
}
