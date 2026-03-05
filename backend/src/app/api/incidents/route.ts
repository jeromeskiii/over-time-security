import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateIncidentPayload } from '@/lib/incidentValidation';
import { IncidentSeverity, IncidentType } from '@prisma/client';

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
    const severity = searchParams.get('severity');
    const shiftId = searchParams.get('shiftId');

    const incidents = await prisma.incident.findMany({
      where: {
        ...(guardId && { guardId }),
        ...(siteId && { siteId }),
        ...(shiftId && { shiftId }),
        ...(severity && { severity: severity.toUpperCase() as IncidentSeverity }),
      },
      include: {
        guard: { select: { name: true } },
        site: { select: { location: true } },
      },
      orderBy: { occurredAt: 'desc' },
    });

    return NextResponse.json({ incidents }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch incidents.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateIncidentPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const { guardId, siteId, description, severity, type, photoKeys, shiftId, occurredAt } =
      validation.data;

    const incident = await prisma.incident.create({
      data: {
        guardId,
        siteId,
        description,
        occurredAt: new Date(occurredAt),
        ...(severity && { severity: severity as IncidentSeverity }),
        ...(type && { type: type as IncidentType }),
        ...(photoKeys && photoKeys.length > 0 && { photoKeys }),
        ...(shiftId && { shiftId }),
      },
    });

    return NextResponse.json({ success: true, incident }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create incident.' }, { status: 500, headers: corsHeaders() });
  }
}