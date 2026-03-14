import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ots/db";
import { dispatchIntakeValidator } from "@ots/domain/validators";
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
    const result = dispatchIntakeValidator.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request" },
        { status: 400, headers: buildPublicCorsHeaders(origin) }
      );
    }

    const data = result.data;

    const dispatchRequest = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceType: "Dispatch Coverage",
        message: `Property Type: ${data.propertyType}
Coverage Hours: ${data.coverageHours}
Armed/Patrol: ${data.armedOrPatrol}
Site Address: ${data.siteAddress}
${data.accessNotes ? `Access Notes: ${data.accessNotes}` : ""}`,
        status: "NEW",
      },
    });

    if (process.env.REDIS_URL) {
      try {
        const { createEventBus } = await import("@ots/automation");
        const eventBus = createEventBus();
        await eventBus.emit("LEAD_CREATED", {
          entityType: "lead",
          entityId: dispatchRequest.id,
          payload: {
            leadId: dispatchRequest.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            service: "Dispatch Coverage",
            propertyType: data.propertyType,
            coverageHours: data.coverageHours,
            armedOrPatrol: data.armedOrPatrol,
            siteAddress: data.siteAddress,
          },
        });
      } catch (automationError) {
        console.error("Automation emit failed:", automationError);
      }
    }

    return NextResponse.json(
      { success: true, id: dispatchRequest.id },
      { headers: buildPublicCorsHeaders(origin) }
    );
  } catch (error) {
    console.error("Dispatch intake error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500, headers: buildPublicCorsHeaders(origin) }
    );
  }
}
