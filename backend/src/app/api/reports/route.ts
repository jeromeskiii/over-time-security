import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateReportPayload } from '@/lib/reportValidation';

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

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: { incident: { select: { description: true, severity: true, occurredAt: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reports.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateReportPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const report = await prisma.report.create({ data: validation.data });
    return NextResponse.json({ success: true, report }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create report.' }, { status: 500, headers: corsHeaders() });
  }
}
