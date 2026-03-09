import { describe, it, expect } from 'vitest';
import { leadValidator, shiftSchema, incidentValidator } from '../validators/index.js';

describe('leadValidator', () => {
  const validLead = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1 800 555 0199',
    serviceType: 'armed-unarmed',
    message: 'We need overnight security coverage.',
  };

  it('accepts a valid lead input', () => {
    const result = leadValidator.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it('accepts an optional company field', () => {
    const result = leadValidator.safeParse({ ...validLead, company: 'Acme Corp' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.company).toBe('Acme Corp');
  });

  it('rejects a name shorter than 2 characters', () => {
    const result = leadValidator.safeParse({ ...validLead, name: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email address', () => {
    const result = leadValidator.safeParse({ ...validLead, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a message shorter than 10 characters', () => {
    const result = leadValidator.safeParse({ ...validLead, message: 'Too short' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing serviceType', () => {
    const { serviceType: _, ...rest } = validLead;
    const result = leadValidator.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

describe('shiftSchema', () => {
  const now = new Date();
  const later = new Date(now.getTime() + 8 * 60 * 60 * 1000); // +8 hours
  const guardId = 'cm0000000000000000000000a';
  const siteId = 'cm0000000000000000000000b';

  it('accepts a valid shift', () => {
    const result = shiftSchema.safeParse({
      guardId,
      siteId,
      startTime: now,
      endTime: later,
    });
    expect(result.success).toBe(true);
  });

  it('rejects when endTime is before startTime', () => {
    const result = shiftSchema.safeParse({
      guardId,
      siteId,
      startTime: later,
      endTime: now,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('endTime');
    }
  });

  it('rejects when endTime equals startTime', () => {
    const result = shiftSchema.safeParse({
      guardId,
      siteId,
      startTime: now,
      endTime: now,
    });
    expect(result.success).toBe(false);
  });

  it('coerces ISO string dates', () => {
    const result = shiftSchema.safeParse({
      guardId,
      siteId,
      startTime: now.toISOString(),
      endTime: later.toISOString(),
    });
    expect(result.success).toBe(true);
  });
});

describe('incidentValidator', () => {
  const base = {
    siteId: 'cm0000000000000000000000b',
    type: 'THEFT' as const,
    description: 'A laptop was taken from the reception desk.',
    severity: 'HIGH' as const,
  };

  it('accepts a valid incident', () => {
    const result = incidentValidator.safeParse(base);
    expect(result.success).toBe(true);
  });

  it('accepts an optional shiftId', () => {
    const result = incidentValidator.safeParse({
      ...base,
      shiftId: 'cm0000000000000000000000c',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an unknown incident type', () => {
    const result = incidentValidator.safeParse({ ...base, type: 'EXPLOSION' });
    expect(result.success).toBe(false);
  });

  it('rejects a description shorter than 10 characters', () => {
    const result = incidentValidator.safeParse({ ...base, description: 'Short' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown severity level', () => {
    const result = incidentValidator.safeParse({ ...base, severity: 'EXTREME' });
    expect(result.success).toBe(false);
  });
});
