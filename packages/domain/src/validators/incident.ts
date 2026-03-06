import { z } from 'zod';

export const incidentValidator = z.object({
  shiftId: z.string().cuid(),
  guardId: z.string().cuid(),
  siteId: z.string().cuid(),
  type: z.enum([
    'TRESPASS',
    'THEFT',
    'VANDALISM',
    'MEDICAL',
    'FIRE',
    'SUSPICIOUS_ACTIVITY',
    'OTHER',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  photoKeys: z.array(z.string()).default([]),
});

export type IncidentInput = z.infer<typeof incidentValidator>;
