import { z } from 'zod';

export const dispatchIntakeValidator = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, 'Invalid phone number'),
  propertyType: z.string().min(1, 'Property type is required'),
  coverageHours: z.string().min(1, 'Coverage hours required'),
  armedOrPatrol: z.string().min(1, 'Coverage type required'),
  siteAddress: z.string().min(5, 'Site address required').max(500),
  accessNotes: z.string().max(1000).optional(),
});

export type DispatchIntakeInput = z.infer<typeof dispatchIntakeValidator>;
