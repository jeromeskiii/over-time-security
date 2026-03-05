import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateClientPayload } from '@/lib/clientValidation';

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
    const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ clients }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch clients.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateClientPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const client = await prisma.client.create({ data: validation.data });
    return NextResponse.json({ success: true, client }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create client.' }, { status: 500, headers: corsHeaders() });
  }
}
