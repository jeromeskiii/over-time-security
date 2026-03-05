const VALID_STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
type ShiftStatus = typeof VALID_STATUSES[number];

export type ShiftPayload = {
  guardId: string;
  siteId: string;
  startTime: string;
  endTime: string;
  status?: ShiftStatus;
};

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validateShiftPayload(input: unknown):
  | { ok: true; data: ShiftPayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const guardId = normalize(record.guardId);
  const siteId = normalize(record.siteId);
  const startTime = normalize(record.startTime);
  const endTime = normalize(record.endTime);
  const statusRaw = normalize(record.status).toUpperCase();

  if (!guardId || !siteId || !startTime || !endTime) {
    return { ok: false, error: 'Missing required fields: guardId, siteId, startTime, endTime.' };
  }

  if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
    return { ok: false, error: 'startTime and endTime must be valid ISO date strings.' };
  }

  if (new Date(endTime) <= new Date(startTime)) {
    return { ok: false, error: 'endTime must be after startTime.' };
  }

  if (statusRaw && !VALID_STATUSES.includes(statusRaw as ShiftStatus)) {
    return { ok: false, error: 'Invalid status.' };
  }

  return {
    ok: true,
    data: {
      guardId,
      siteId,
      startTime,
      endTime,
      status: statusRaw ? (statusRaw as ShiftStatus) : undefined,
    },
  };
}
