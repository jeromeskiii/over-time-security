export type ReportPayload = {
  incidentId: string;
  content: string;
};

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validateReportPayload(input: unknown):
  | { ok: true; data: ReportPayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const incidentId = normalize(record.incidentId);
  const content = normalize(record.content);

  if (!incidentId || !content) {
    return { ok: false, error: 'Missing required fields: incidentId, content.' };
  }

  if (incidentId.length > 100 || content.length > 10000) {
    return { ok: false, error: 'One or more fields exceed max length.' };
  }

  return {
    ok: true,
    data: { incidentId, content },
  };
}
