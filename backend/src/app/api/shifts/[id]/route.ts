import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ShiftStatus } from '@prisma/client';

const VALID_STATUSES: ShiftStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

function corsHeaders() {
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const shift = await prisma.shift.findUnique({
      where: { id },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
      },
    });
    if (!shift) return NextResponse.json({ error: 'Shift not found.' }, { status: 404, headers: corsHeaders() });
    return NextResponse.json({ shift }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch shift.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    if (!body.status) {
      return NextResponse.json({ error: 'status is required.' }, { status: 400, headers: corsHeaders() });
    }

    const s = body.status.toUpperCase() as ShiftStatus;
    if (!VALID_STATUSES.includes(s)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400, headers: corsHeaders() });
    }

    const shift = await prisma.shift.update({ where: { id }, data: { status: s } });
    return NextResponse.json({ success: true, shift }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to update shift.' }, { status: 500, headers: corsHeaders() });
  }
}
