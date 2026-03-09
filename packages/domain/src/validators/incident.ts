import { z } from 'zod';

// guardId and siteId ownership are verified server-side via session
export const incidentValidator = z.object({
  siteId: z.string().cuid(),
  shiftId: z.string().cuid().optional(),
  type: z.enum([
    'THEFT',
    'VANDALISM',
    'TRESPASS',
    'MEDICAL',
    'FIRE',
    'SUSPICIOUS_ACTIVITY',
    'OTHER',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  photoKeys: z.array(z.string()).default([]),
  occurredAt: z.string().optional(),
});

export type IncidentInput = z.infer<typeof incidentValidator>;
