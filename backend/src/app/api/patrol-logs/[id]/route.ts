import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function corsHeaders() {
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const patrolLog = await prisma.patrolLog.findUnique({
      where: { id },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
        shift: { select: { startTime: true, endTime: true, status: true } },
      },
    });
    if (!patrolLog) {
      return NextResponse.json({ error: 'Patrol log not found.' }, { status: 404, headers: corsHeaders() });
    }
    return NextResponse.json({ patrolLog }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch patrol log.' }, { status: 500, headers: corsHeaders() });
  }
}
