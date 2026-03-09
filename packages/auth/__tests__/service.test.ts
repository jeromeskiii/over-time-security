import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateOtp, hashPin, verifyPin } from "../src/service.js";

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
  });

  it("allows login when guard has no pinHash (migration mode)", async () => {
    const { prisma } = await import("@ots/db");
    (prisma.guard.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "guard-1",
      name: "Test Guard",
      phone: "5551234567",
      status: "ACTIVE",
      pinHash: null,
    });
    (prisma.event.create as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { verifyGuardPin } = await import("../src/service.js");
    const result = await verifyGuardPin("5551234567", "any-pin");
    expect(result.success).toBe(true);
    expect(result.session?.user.role).toBe("guard");
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
