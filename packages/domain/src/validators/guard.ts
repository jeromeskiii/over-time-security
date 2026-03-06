import { z } from "zod";

export const guardStatusSchema = z.enum(["active", "inactive", "suspended"]);

export const guardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  status: guardStatusSchema.default("active"),
});

export type GuardInput = z.infer<typeof guardSchema>;
