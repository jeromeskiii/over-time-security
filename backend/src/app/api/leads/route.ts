import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateLeadPayload } from '@/lib/leadValidation';

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

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateLeadPayload(payload);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders() });
    }

    const lead = await prisma.lead.create({
      data: {
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        company: validation.data.company,
        serviceType: validation.data.serviceType,
        message: validation.data.message,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to create lead.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const leads = await prisma.lead.findMany({
      where: status
        ? {
            status: status.toUpperCase() as
              | 'NEW'
              | 'CONTACTED'
              | 'QUOTED'
              | 'WON'
              | 'LOST',
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ leads }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500, headers: corsHeaders() });
  }
}
