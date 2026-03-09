import { z } from 'zod';

// guardId is server-derived from the session — not accepted from the client
export const checkInValidator = z.object({
  shiftId: z.string().cuid(),
  siteId: z.string().cuid(),
  checkInType: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  notes: z.string().max(2000).optional(),
});

export type CheckInInput = z.infer<typeof checkInValidator>;
