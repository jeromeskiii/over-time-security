export type CheckInPayload = {
  shiftId: string;
  guardId: string;
  siteId: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
};

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function optionalFloat(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
}

export function validateCheckInPayload(input: unknown):
  | { ok: true; data: CheckInPayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const shiftId = normalize(record.shiftId);
  const guardId = normalize(record.guardId);
  const siteId = normalize(record.siteId);
  const timestamp = normalize(record.timestamp);
  const latitude = optionalFloat(record.latitude);
  const longitude = optionalFloat(record.longitude);
  const notes = normalize(record.notes);

  if (!shiftId || !guardId || !siteId || !timestamp) {
    return { ok: false, error: 'Missing required fields: shiftId, guardId, siteId, timestamp.' };
  }

  if (isNaN(Date.parse(timestamp))) {
    return { ok: false, error: 'timestamp must be a valid ISO date string.' };
  }

  if (notes && notes.length > 1000) {
    return { ok: false, error: 'notes exceeds max length of 1000 characters.' };
  }

  return {
    ok: true,
    data: {
      shiftId,
      guardId,
      siteId,
      timestamp,
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
      ...(notes && { notes }),
    },
  };
}
