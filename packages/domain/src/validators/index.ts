import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, 'Invalid phone number'),
  company: z.string().max(100).optional(),
  serviceType: z.string().min(1, 'Service type is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const createShiftSchema = z.object({
  guardId: z.string().cuid('Invalid guard ID'),
  siteId: z.string().cuid('Invalid site ID'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const createIncidentSchema = z.object({
  guardId: z.string().cuid('Invalid guard ID'),
  siteId: z.string().cuid('Invalid site ID'),
  shiftId: z.string().cuid('Invalid shift ID').optional(),
  type: z.enum([
    'THEFT',
    'VANDALISM',
    'TRESPASS',
    'MEDICAL',
    'FIRE',
    'SUSPICIOUS_ACTIVITY',
    'OTHER',
  ]),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  occurredAt: z.coerce.date(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type CreateShiftInput = z.infer<typeof createShiftSchema>;
export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
