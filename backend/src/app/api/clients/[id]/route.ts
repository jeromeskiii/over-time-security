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
    const client = await prisma.client.findUnique({ where: { id }, include: { sites: true } });
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404, headers: corsHeaders() });
    return NextResponse.json({ client }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch client.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { name?: string; email?: string; phone?: string };

    const data: { name?: string; email?: string; phone?: string } = {};
    if (body.name) data.name = String(body.name).trim();
    if (body.email !== undefined) data.email = body.email ? String(body.email).trim().toLowerCase() : null as unknown as string;
    if (body.phone !== undefined) data.phone = body.phone ? String(body.phone).trim() : null as unknown as string;

    const client = await prisma.client.update({ where: { id }, data });
    return NextResponse.json({ success: true, client }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to update client.' }, { status: 500, headers: corsHeaders() });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders() });
  } catch {
    return NextResponse.json({ error: 'Failed to delete client.' }, { status: 500, headers: corsHeaders() });
  }
}
