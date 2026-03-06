import type { UserRole } from "../models";

export type Permission =
  | "leads:read"
  | "leads:write"
  | "guards:read"
  | "guards:write"
  | "clients:read"
  | "clients:write"
  | "sites:read"
  | "sites:write"
  | "shifts:read"
  | "shifts:write"
  | "incidents:read"
  | "incidents:write"
  | "reports:read"
  | "reports:write"
  | "users:read"
  | "users:write"
  | "settings:read"
  | "settings:write";

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "leads:read",
    "leads:write",
    "guards:read",
    "guards:write",
    "clients:read",
    "clients:write",
    "sites:read",
    "sites:write",
    "shifts:read",
    "shifts:write",
    "incidents:read",
    "incidents:write",
    "reports:read",
    "reports:write",
    "users:read",
    "users:write",
    "settings:read",
    "settings:write",
  ],
  supervisor: [
    "guards:read",
    "sites:read",
    "shifts:read",
    "shifts:write",
    "incidents:read",
    "incidents:write",
    "reports:read",
  ],
  client: [
    "sites:read",
    "shifts:read",
    "incidents:read",
    "reports:read",
  ],
  guard: [
    "shifts:read",
    "incidents:read",
    "incidents:write",
    "reports:read",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}
