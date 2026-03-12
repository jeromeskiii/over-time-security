import { z } from 'zod';

export const reportQuerySchema = z.object({
  status: z.enum(['PENDING', 'AI_GENERATED', 'SUPERVISOR_REVIEW', 'APPROVED', 'SENT']).optional(),
  siteId: z.string().cuid().optional(),
  incidentId: z.string().cuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
});

export const reportStatusUpdateSchema = z.object({
  status: z.enum(['SUPERVISOR_REVIEW', 'APPROVED', 'SENT']),
  sentTo: z.string().email().optional(),
});

export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
export type ReportStatusUpdateInput = z.infer<typeof reportStatusUpdateSchema>;
