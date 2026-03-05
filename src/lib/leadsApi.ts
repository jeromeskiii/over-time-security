type LeadCreatePayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  message: string;
};

type LeadCreateResult =
  | { ok: true }
  | { ok: false; error: string };

const DEFAULT_LEADS_API_URL = 'http://localhost:3001/api/leads';

export async function submitLead(payload: LeadCreatePayload): Promise<LeadCreateResult> {
  const endpoint = import.meta.env.VITE_LEADS_API_URL ?? DEFAULT_LEADS_API_URL;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: body?.error ?? 'Failed to submit lead.' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error while submitting lead.' };
  }
}
