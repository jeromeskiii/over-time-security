import { LeadStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const statusMap: Record<string, LeadStatus> = {
  new: LeadStatus.NEW,
  contacted: LeadStatus.CONTACTED,
  quoted: LeadStatus.QUOTED,
  won: LeadStatus.WON,
  lost: LeadStatus.LOST,
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as { status?: string };
    const nextStatus = payload.status ? statusMap[payload.status] : undefined;

    if (!nextStatus) {
      return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: nextStatus },
    });

    return NextResponse.json({ success: true, lead }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}
