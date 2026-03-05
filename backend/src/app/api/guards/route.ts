import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateGuardPayload } from '@/lib/guardValidation';
import { GuardStatus } from '@prisma/client';

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
    const status = searchParams.get('status');

    const guards = await prisma.guard.findMany({
      where: status ? { status: status.toUpperCase() as GuardStatus } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ guards }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch guards.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateGuardPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const { name, licenseNumber, phone, status } = validation.data;

    const guard = await prisma.guard.create({
      data: { name, licenseNumber, phone, ...(status && { status }) },
    });

    return NextResponse.json({ success: true, guard }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create guard.' }, { status: 500, headers: corsHeaders() });
  }
}
