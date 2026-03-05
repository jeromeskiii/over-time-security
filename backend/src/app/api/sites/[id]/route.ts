import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const site = await prisma.site.findUnique({ where: { id }, include: { client: true } });
    if (!site) return NextResponse.json({ error: 'Site not found.' }, { status: 404, headers: corsHeaders() });
    return NextResponse.json({ site }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch site.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { location?: string; instructions?: string };

    const data: { location?: string; instructions?: string } = {};
    if (body.location) data.location = String(body.location).trim();
    if (body.instructions !== undefined) data.instructions = body.instructions ? String(body.instructions).trim() : null as unknown as string;

    const site = await prisma.site.update({ where: { id }, data });
    return NextResponse.json({ success: true, site }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to update site.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.site.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to delete site.' }, { status: 500, headers: corsHeaders() });
  }
}
