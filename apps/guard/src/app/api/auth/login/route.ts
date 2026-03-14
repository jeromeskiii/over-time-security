import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestOtpSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  otp: z.string().length(4, "OTP must be 4 digits"),
});

const verifyPinSchema = z.object({
  phone: z.string().min(10, "Invalid phone number"),
  pin: z.string().length(4, "PIN must be 4 digits"),
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { initiateGuardLogin, verifyGuardOtp, verifyGuardPin } = await import("@ots/auth");
  
  try {
    const body = await request.json();
    const { action } = body;

    // Step 1: Request OTP
    if (action === "request-otp") {
      const { phone } = requestOtpSchema.parse(body);
      const result = await initiateGuardLogin(phone);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        requiresOtp: true,
        message: "Code sent to your phone",
      });
    }

    // Step 2: Verify OTP
    if (action === "verify-otp") {
      const { phone, otp } = verifyOtpSchema.parse(body);
      const result = await verifyGuardOtp(phone, otp);

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        requiresPin: true,
      });
    }

    // Step 3: Verify PIN and complete login
    if (action === "verify-pin") {
      const { phone, pin } = verifyPinSchema.parse(body);
      const result = await verifyGuardPin(phone, pin);

      if (!result.success || !result.tokens) {
        return NextResponse.json(
          { error: result.error || "Authentication failed" },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        success: true,
        user: result.session?.user,
      });

      response.cookies.set("session", result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: result.tokens.expiresIn,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }
    console.error("Guard login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
