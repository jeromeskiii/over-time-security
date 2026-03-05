const VALID_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const;
type GuardStatus = typeof VALID_STATUSES[number];

export type GuardPayload = {
  name: string;
  licenseNumber: string;
  phone: string;
  status?: GuardStatus;
};

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validateGuardPayload(input: unknown):
  | { ok: true; data: GuardPayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const name = normalize(record.name);
  const licenseNumber = normalize(record.licenseNumber);
  const phone = normalize(record.phone);
  const statusRaw = normalize(record.status).toUpperCase();

  if (!name || !licenseNumber || !phone) {
    return { ok: false, error: 'Missing required fields: name, licenseNumber, phone.' };
  }

  if (name.length > 200 || licenseNumber.length > 100 || phone.length > 50) {
    return { ok: false, error: 'One or more fields exceed max length.' };
  }

  if (statusRaw && !VALID_STATUSES.includes(statusRaw as GuardStatus)) {
    return { ok: false, error: 'Invalid status. Must be ACTIVE, INACTIVE, or SUSPENDED.' };
  }

  return {
    ok: true,
    data: {
      name,
      licenseNumber,
      phone,
      status: statusRaw ? (statusRaw as GuardStatus) : undefined,
    },
  };
}
