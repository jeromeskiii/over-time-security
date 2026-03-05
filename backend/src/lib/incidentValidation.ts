const VALID_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
type IncidentSeverity = typeof VALID_SEVERITIES[number];

const VALID_TYPES = [
  'THEFT', 'VANDALISM', 'TRESPASS', 'MEDICAL', 'FIRE', 'SUSPICIOUS_ACTIVITY', 'OTHER',
] as const;
type IncidentType = typeof VALID_TYPES[number];

export type IncidentPayload = {
  guardId: string;
  siteId: string;
  description: string;
  severity?: IncidentSeverity;
  type?: IncidentType;
  photoKeys?: string[];
  shiftId?: string;
  occurredAt: string;
};

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validateIncidentPayload(input: unknown):
  | { ok: true; data: IncidentPayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const guardId = normalize(record.guardId);
  const siteId = normalize(record.siteId);
  const description = normalize(record.description);
  const severityRaw = normalize(record.severity).toUpperCase();
  const typeRaw = normalize(record.type).toUpperCase();
  const occurredAt = normalize(record.occurredAt);
  const shiftId = normalize(record.shiftId);

  // photoKeys — array of R2 object key strings
  let photoKeys: string[] | undefined;
  if (Array.isArray(record.photoKeys)) {
    if (record.photoKeys.length > 10) {
      return { ok: false, error: 'photoKeys may contain at most 10 items.' };
    }
    photoKeys = (record.photoKeys as unknown[])
      .map(k => (typeof k === 'string' ? k.trim() : ''))
      .filter(Boolean);
  }

  if (!guardId || !siteId || !description || !occurredAt) {
    return { ok: false, error: 'Missing required fields: guardId, siteId, description, occurredAt.' };
  }

  if (description.length > 2000) {
    return { ok: false, error: 'description exceeds max length.' };
  }

  if (isNaN(Date.parse(occurredAt))) {
    return { ok: false, error: 'occurredAt must be a valid ISO date string.' };
  }

  if (severityRaw && !VALID_SEVERITIES.includes(severityRaw as IncidentSeverity)) {
    return { ok: false, error: 'Invalid severity. Must be LOW, MEDIUM, HIGH, or CRITICAL.' };
  }

  if (typeRaw && !VALID_TYPES.includes(typeRaw as IncidentType)) {
    return {
      ok: false,
      error: 'Invalid type. Must be THEFT, VANDALISM, TRESPASS, MEDICAL, FIRE, SUSPICIOUS_ACTIVITY, or OTHER.',
    };
  }

  return {
    ok: true,
    data: {
      guardId,
      siteId,
      description,
      severity: severityRaw ? (severityRaw as IncidentSeverity) : undefined,
      type: typeRaw ? (typeRaw as IncidentType) : undefined,
      photoKeys,
      shiftId: shiftId || undefined,
      occurredAt,
    },
  };
}