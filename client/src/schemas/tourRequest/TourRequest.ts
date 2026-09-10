import { z } from "zod";
import { propertySchema } from "../property/Property";

export const TYPE_VALUES = [
  "pending",
  "accepted",
  "rejected",
  "canceled",
] as const;

export const tourRequestSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  agentId: z.number().int().positive(),
  requesterId: z.number().int().positive(),
  requestedAt: z.coerce.date(),
  status: z.enum(TYPE_VALUES).default("pending"),
});

export const tourRequestWithPropertySchema = tourRequestSchema.extend({
  Property: propertySchema,
});

export type TourRequest = z.infer<typeof tourRequestSchema>;
export type TourRequestWithProperty = z.infer<
  typeof tourRequestWithPropertySchema
>;
