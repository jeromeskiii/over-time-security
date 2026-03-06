import { z } from "zod";

export const shiftStatusSchema = z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

export const shiftSchema = z.object({
  guardId: z.string().min(1, "Guard is required"),
  siteId: z.string().min(1, "Site is required"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: shiftStatusSchema.default("SCHEDULED"),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type ShiftInput = z.infer<typeof shiftSchema>;
