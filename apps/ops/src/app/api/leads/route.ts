import { NextRequest, NextResponse } from "next/server";
import { prisma, LeadStatus } from "@ots/db";
import { z } from "zod";

const ORIGINS = [
  process.env.WEB_APP_URL,
  "https://overtimesecurity.com",
  "https://www.overtimesecurity.com",
].filter(Boolean);

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  company: z.string().optional(),
  serviceType: z.string().min(1),
  message: z.string().min(10),
});

function corsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = origin && ORIGINS.includes(origin) ? origin : ORIGINS[0] || "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  try {
    const body = await request.json();
    const data = createLeadSchema.parse(body);

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

    // Emit event for automation (non-blocking, fails gracefully)
    if (process.env.REDIS_URL) {
      try {
        const { createEventBus } = await import("@ots/automation");
        const eventBus = createEventBus();
        await eventBus.emit("LEAD_CREATED", {
          entityType: "lead",
          entityId: lead.id,
          payload: {
            leadId: lead.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            service: data.serviceType,
          },
        });
      } catch (automationError) {
        // Log but don't fail the request - lead is already saved
        console.error("Automation emit failed:", automationError);
      }
    }

    return NextResponse.json(
      { success: true, lead: { id: lead.id, createdAt: lead.createdAt } },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400, headers: corsHeaders(origin) }
      );
    }
    console.error("Create lead error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
