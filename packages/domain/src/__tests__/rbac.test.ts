import { describe, it, expect } from "vitest";
import { hasPermission, getPermissions } from "../policies/rbac";

describe("hasPermission", () => {
  it("admin has all critical permissions", () => {
    expect(hasPermission("admin", "guards:read")).toBe(true);
    expect(hasPermission("admin", "guards:write")).toBe(true);
    expect(hasPermission("admin", "incidents:write")).toBe(true);
    expect(hasPermission("admin", "settings:write")).toBe(true);
  });

  it("supervisor cannot write guards or settings", () => {
    expect(hasPermission("supervisor", "guards:write")).toBe(false);
    expect(hasPermission("supervisor", "settings:write")).toBe(false);
  });

  it("supervisor can write shifts and incidents", () => {
    expect(hasPermission("supervisor", "shifts:write")).toBe(true);
    expect(hasPermission("supervisor", "incidents:write")).toBe(true);
  });

  it("client has read-only access", () => {
    expect(hasPermission("client", "sites:read")).toBe(true);
    expect(hasPermission("client", "incidents:read")).toBe(true);
    expect(hasPermission("client", "incidents:write")).toBe(false);
    expect(hasPermission("client", "guards:read")).toBe(false);
  });

  it("guard can only write incidents", () => {
    expect(hasPermission("guard", "incidents:write")).toBe(true);
    expect(hasPermission("guard", "incidents:read")).toBe(true);
    expect(hasPermission("guard", "shifts:write")).toBe(false);
    expect(hasPermission("guard", "guards:read")).toBe(false);
  });
});

describe("getPermissions", () => {
  it("returns array of permissions for a role", () => {
    const perms = getPermissions("admin");
    expect(Array.isArray(perms)).toBe(true);
    expect(perms.length).toBeGreaterThan(0);
  });
});
