export type SitePayload = {
  clientId: string;
  location: string;
  instructions?: string;
};

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validateSitePayload(input: unknown):
  | { ok: true; data: SitePayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const clientId = normalize(record.clientId);
  const location = normalize(record.location);
  const instructions = normalize(record.instructions);

  if (!clientId || !location) {
    return { ok: false, error: 'Missing required fields: clientId, location.' };
  }

  if (clientId.length > 100 || location.length > 500 || instructions.length > 2000) {
    return { ok: false, error: 'One or more fields exceed max length.' };
  }

  return {
    ok: true,
    data: {
      clientId,
      location,
      instructions: instructions || undefined,
    },
  };
}
