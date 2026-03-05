import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IncidentSeverity } from '@prisma/client';

const VALID_SEVERITIES: IncidentSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

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
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
        report: true,
      },
    });
    if (!incident) return NextResponse.json({ error: 'Incident not found.' }, { status: 404, headers: corsHeaders() });
    return NextResponse.json({ incident }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch incident.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { description?: string; severity?: string };

    const data: { description?: string; severity?: IncidentSeverity } = {};
    if (body.description) data.description = String(body.description).trim();
    if (body.severity) {
      const s = body.severity.toUpperCase() as IncidentSeverity;
      if (!VALID_SEVERITIES.includes(s)) {
        return NextResponse.json({ error: 'Invalid severity.' }, { status: 400, headers: corsHeaders() });
      }
      data.severity = s;
    }

    const incident = await prisma.incident.update({ where: { id }, data });
    return NextResponse.json({ success: true, incident }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to update incident.' }, { status: 500, headers: corsHeaders() });
  }
}
