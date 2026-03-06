import { z } from 'zod';

export const patrolLogValidator = z.object({
  shiftId: z.string().cuid(),
  guardId: z.string().cuid(),
  checkpoint: z.string().min(1).max(200),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  notes: z.string().max(2000).optional(),
});

export type PatrolLogInput = z.infer<typeof patrolLogValidator>;
