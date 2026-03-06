import type { Guard, Shift, Incident } from "../models";

export function canGuardCheckIn(guard: Guard, shift: Shift): boolean {
  if (guard.status !== "ACTIVE") return false;
  if (shift.status === "CANCELLED") return false;
  if (shift.guardId !== guard.id) return false;

  const now = new Date();
  const shiftStart = new Date(shift.startTime);
  const shiftEnd = new Date(shift.endTime);

  return now >= shiftStart && now <= shiftEnd;
}

export function canGuardReportIncident(guard: Guard, shift: Shift): boolean {
  return canGuardCheckIn(guard, shift);
}

export function isShiftActive(shift: Shift): boolean {
  const now = new Date();
  const shiftStart = new Date(shift.startTime);
  const shiftEnd = new Date(shift.endTime);

  return now >= shiftStart && now <= shiftEnd && shift.status === "IN_PROGRESS";
}

export function canModifyIncident(incident: Incident, guardId: string): boolean {
  return incident.guardId === guardId;
}
