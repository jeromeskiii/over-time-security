import { describe, it, expect, beforeAll } from "vitest";
import { createSession, verifySession } from "../src/jwt.js";
import type { SessionUser } from "../src/types.js";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-key-for-unit-tests-min-32-chars!!";
});

const guardUser: SessionUser = {
  id: "guard-abc123",
  phone: "5551234567",
  name: "Test Guard",
  role: "guard",
  guardId: "abc123",
};

const adminUser: SessionUser = {
  id: "admin-1",
  email: "admin@example.com",
  name: "Admin",
  role: "admin",
};

describe("createSession + verifySession", () => {
  it("guard token expires in 12 hours (43200s)", async () => {
    const tokens = await createSession(guardUser);
    expect(tokens.expiresIn).toBe(43200);
  });

  it("admin token expires in 8 hours (28800s)", async () => {
    const tokens = await createSession(adminUser);
    expect(tokens.expiresIn).toBe(28800);
  });

  it("round-trips guard session correctly", async () => {
    const tokens = await createSession(guardUser);
    const session = await verifySession(tokens.accessToken);
    expect(session).not.toBeNull();
    expect(session!.user.guardId).toBe("abc123");
    expect(session!.user.role).toBe("guard");
  });

  it("returns null for invalid token", async () => {
    const session = await verifySession("invalid.token.here");
    expect(session).toBeNull();
  });
});
