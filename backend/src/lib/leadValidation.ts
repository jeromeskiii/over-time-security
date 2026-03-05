const MAX_FIELD_LENGTH = 2000;

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validateLeadPayload(input: unknown):
  | { ok: true; data: LeadPayload }
  | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Invalid payload.' };
  }

  const record = input as Record<string, unknown>;

  const name = normalize(record.name);
  const email = normalize(record.email).toLowerCase();
  const phone = normalize(record.phone);
  const company = normalize(record.company);
  const serviceType = normalize(record.serviceType);
  const message = normalize(record.message);

  if (!name || !email || !phone || !serviceType || !message) {
    return { ok: false, error: 'Missing required fields.' };
  }

  if (!emailRegex.test(email)) {
    return { ok: false, error: 'Invalid email format.' };
  }

  if (
    name.length > 200 ||
    email.length > 320 ||
    phone.length > 50 ||
    company.length > 200 ||
    serviceType.length > 120 ||
    message.length > MAX_FIELD_LENGTH
  ) {
    return { ok: false, error: 'One or more fields exceed max length.' };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      company: company || undefined,
      serviceType,
      message,
    },
  };
}
