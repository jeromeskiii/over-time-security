import { z } from 'zod';

export const leadValidator = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number required').max(20).optional(),
  company: z.string().max(200).optional(),
  service: z.string().min(1, 'Service is required'),
  message: z.string().max(2000).optional(),
});

export type LeadInput = z.infer<typeof leadValidator>;
