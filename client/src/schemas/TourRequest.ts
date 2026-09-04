import { z } from "zod";

export const TYPE_VALUES = [
  "pending",
  "accepted",
  "rejected",
  "canceled",
] as const;

export const tourRequestSchema = z.object({
  id: z.number().int().positive(),
  propertyId: z.number().int().positive(),
  agentId: z.number().int().positive(),
  requesterId: z.number().int().positive(),
  requestedAt: z.coerce.date(),
  status: z.enum(TYPE_VALUES).default("pending"),
});

export type TourRequest = z.infer<typeof tourRequestSchema>;
