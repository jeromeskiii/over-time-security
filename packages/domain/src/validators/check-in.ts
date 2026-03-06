import { z } from 'zod';

export const checkInValidator = z.object({
  shiftId: z.string().cuid(),
  guardId: z.string().cuid(),
  type: z.enum(['CLOCK_IN', 'CLOCK_OUT']),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type CheckInInput = z.infer<typeof checkInValidator>;
