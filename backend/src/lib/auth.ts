export const SESSION_COOKIE_NAME = 'ots_session';

export type UserRole = 'admin' | 'guard';

type SessionPayload = {
  role: UserRole;
  expiresAt: number;
};

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signValue(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(
  role: UserRole,
  secret: string,
  ttlSeconds: number
): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${role}:${expiresAt}`;
  const signature = await signValue(secret, payload);
  return `${payload}:${signature}`;
}

export async function verifySessionToken(
  token: string,
  secret: string
): Promise<SessionPayload | null> {
  const parts = token.split(':');
  if (parts.length !== 3) return null;

  const [roleRaw, expiresAtRaw, signature] = parts;
  if (roleRaw !== 'admin' && roleRaw !== 'guard') return null;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  const payload = `${roleRaw}:${expiresAt}`;
  const expectedSignature = await signValue(secret, payload);

  const left = fromBase64Url(signature);
  const right = fromBase64Url(expectedSignature);
  if (left.length !== right.length) return null;

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }
  if (mismatch !== 0) return null;

  return { role: roleRaw, expiresAt };
}
