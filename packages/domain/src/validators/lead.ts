import { z } from 'zod';

export const leadValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, 'Invalid phone number'),
  company: z.string().max(100).optional(),
  serviceType: z.string().min(1, 'Service type is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type LeadInput = z.infer<typeof leadValidator>;
