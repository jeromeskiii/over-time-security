import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GuardStatus } from '@prisma/client';

const VALID_STATUSES: GuardStatus[] = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

function corsHeaders() {
  const origin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const guard = await prisma.guard.findUnique({ where: { id } });
    if (!guard) return NextResponse.json({ error: 'Guard not found.' }, { status: 404, headers: corsHeaders() });
    return NextResponse.json({ guard }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch guard.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { name?: string; phone?: string; status?: string };

    const data: { name?: string; phone?: string; status?: GuardStatus } = {};
    if (body.name) data.name = String(body.name).trim();
    if (body.phone) data.phone = String(body.phone).trim();
    if (body.status) {
      const s = body.status.toUpperCase() as GuardStatus;
      if (!VALID_STATUSES.includes(s)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400, headers: corsHeaders() });
      }
      data.status = s;
    }

    const guard = await prisma.guard.update({ where: { id }, data });
    return NextResponse.json({ success: true, guard }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to update guard.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.guard.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to delete guard.' }, { status: 500, headers: corsHeaders() });
  }
}
