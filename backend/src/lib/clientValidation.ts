const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ClientPayload = {
  name: string;
  email?: string;
  phone?: string;
};

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validateClientPayload(input: unknown):
  | { ok: true; data: ClientPayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const name = normalize(record.name);
  const email = normalize(record.email).toLowerCase();
  const phone = normalize(record.phone);

  if (!name) {
    return { ok: false, error: 'Missing required field: name.' };
  }

  if (name.length > 200 || email.length > 320 || phone.length > 50) {
    return { ok: false, error: 'One or more fields exceed max length.' };
  }

  if (email && !emailRegex.test(email)) {
    return { ok: false, error: 'Invalid email format.' };
  }

  return {
    ok: true,
    data: {
      name,
      email: email || undefined,
      phone: phone || undefined,
    },
  };
}
