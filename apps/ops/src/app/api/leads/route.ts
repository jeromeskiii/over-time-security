import { NextRequest, NextResponse } from "next/server";
import { prisma, LeadStatus } from "@ots/db";
import { leadValidator } from "@ots/domain/validators";
import { z } from "zod";
import { buildPublicCorsHeaders, rejectDisallowedOrigin } from "@/lib/public-api";

export async function OPTIONS(request: NextRequest) {
  const rejection = rejectDisallowedOrigin(request);
  if (rejection) {
    return rejection;
  }

  return new NextResponse(null, {
    status: 204,
    headers: buildPublicCorsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const rejection = rejectDisallowedOrigin(request);

  if (rejection) {
    return rejection;
  }

  try {
    const body = await request.json();
    const result = leadValidator.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request" },
        { status: 400, headers: buildPublicCorsHeaders(origin) }
      );
    }

    const data = result.data;

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
      { headers: buildPublicCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500, headers: buildPublicCorsHeaders(origin) }
    );
  }
}
