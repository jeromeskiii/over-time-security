import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, LeadStatus } from "@ots/db";
import { z } from "zod";
import { processNewLead, createEventBus } from "@ots/automation";

const prisma = new PrismaClient();

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  serviceType: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createLeadSchema.parse(body);

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        serviceType: data.serviceType,
        message: data.message,
        status: LeadStatus.NEW,
      },
    });

    // Emit event for automation
    const eventBus = createEventBus();
    await processNewLead(eventBus, {
      leadId: lead.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.serviceType,
    });

    return NextResponse.json({
      success: true,
      lead: { id: lead.id, createdAt: lead.createdAt },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Create lead error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
