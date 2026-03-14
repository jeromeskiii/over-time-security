import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateOtp,
  hashPin,
  verifyPin,
  initiateGuardLogin,
} from "../src/service.js";

const { mockTwilioFactory, mockTwilioCreate } = vi.hoisted(() => ({
  mockTwilioFactory: vi.fn(),
  mockTwilioCreate: vi.fn(),
}));

// Mock @ots/db
vi.mock("@ots/db", () => ({
  prisma: {
    guard: {
      findFirst: vi.fn(),
    },
    verificationToken: {
      deleteMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
    },
    event: {
      create: vi.fn(),
    },
  },
  ActorType: { GUARD: "GUARD" },
}));

vi.mock("twilio", () => ({
  default: mockTwilioFactory.mockImplementation(() => ({
    messages: {
      create: mockTwilioCreate,
    },
  })),
}));

vi.mock("../src/jwt.js", () => ({
  createSession: vi.fn().mockResolvedValue({
    accessToken: "mock-token",
    refreshToken: "mock-refresh",
    expiresIn: 43200,
  }),
}));

describe("generateOtp", () => {
  it("generates a 4-digit string", () => {
    const otp = generateOtp();
    expect(otp).toMatch(/^\d{4}$/);
  });

  it("generates values in range 1000-9999", () => {
    for (let i = 0; i < 30; i++) {
      const n = parseInt(generateOtp(), 10);
      expect(n).toBeGreaterThanOrEqual(1000);
      expect(n).toBeLessThanOrEqual(9999);
    }
  });
});

describe("hashPin / verifyPin", () => {
  it("verifies correct PIN", async () => {
    const stored = await hashPin("1234");
    expect(await verifyPin("1234", stored)).toBe(true);
  });

  it("rejects wrong PIN", async () => {
    const stored = await hashPin("1234");
    expect(await verifyPin("9999", stored)).toBe(false);
  });

  it("different PINs produce different hashes", async () => {
    const h1 = await hashPin("1111");
    const h2 = await hashPin("2222");
    expect(h1).not.toBe(h2);
  });
});

describe("verifyGuardPin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTwilioFactory.mockClear();
    mockTwilioCreate.mockReset();
    process.env.NODE_ENV = "test";
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_PHONE_NUMBER;
  });

  it("sends OTP via Twilio when SMS credentials are configured", async () => {
    const { prisma } = await import("@ots/db");
    (prisma.guard.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "guard-1",
      name: "Test Guard",
      phone: "5551234567",
      status: "ACTIVE",
      pinHash: "$2a$10$existing",
    });
    (prisma.verificationToken.deleteMany as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (prisma.verificationToken.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
    mockTwilioCreate.mockResolvedValue({ sid: "SM123" });

    process.env.TWILIO_ACCOUNT_SID = "sid";
    process.env.TWILIO_AUTH_TOKEN = "token";
    process.env.TWILIO_PHONE_NUMBER = "+15550001111";

    const result = await initiateGuardLogin("(555) 123-4567");

    expect(result.success).toBe(true);
    expect(mockTwilioFactory).toHaveBeenCalledWith("sid", "token");
    expect(mockTwilioCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "+15551234567",
        from: "+15550001111",
      })
    );
  });

  it("logs OTP in non-production when SMS is not configured", async () => {
    const { prisma } = await import("@ots/db");
    (prisma.guard.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "guard-1",
      name: "Test Guard",
      phone: "5551234567",
      status: "ACTIVE",
      pinHash: "$2a$10$existing",
    });
    (prisma.verificationToken.deleteMany as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (prisma.verificationToken.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await initiateGuardLogin("5551234567");

    expect(result.success).toBe(true);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("OTP for 5551234567"));
    expect(mockTwilioCreate).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it("rejects login when guard has no pinHash", async () => {
    const { prisma } = await import("@ots/db");
    (prisma.guard.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "guard-1",
      name: "Test Guard",
      phone: "5551234567",
      status: "ACTIVE",
      pinHash: null,
    });
    const { verifyGuardPin } = await import("../src/service.js");
    const result = await verifyGuardPin("5551234567", "any-pin");
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/pin setup incomplete/i);
  });

  it("rejects login for SUSPENDED guard", async () => {
    const { prisma } = await import("@ots/db");
    (prisma.guard.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "guard-2",
      name: "Suspended",
      phone: "5559999999",
      status: "SUSPENDED",
      pinHash: null,
    });

    const { verifyGuardPin } = await import("../src/service.js");
    const result = await verifyGuardPin("5559999999", "1234");
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not active/i);
  });
});
