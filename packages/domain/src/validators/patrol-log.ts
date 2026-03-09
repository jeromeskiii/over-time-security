import { z } from 'zod';

// guardId is server-derived from the session — not accepted from the client
export const patrolLogValidator = z.object({
  shiftId: z.string().cuid(),
  siteId: z.string().cuid(),
  checkpoint: z.string().min(1).max(200),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  notes: z.string().max(2000).optional(),
});

export type PatrolLogInput = z.infer<typeof patrolLogValidator>;
