import { z } from "zod";

export const TYPE_VALUES = [
  "incomingRequest",
  "requestUpdate",
  "message",
] as const;

export const notificationSchema = z.object({
  id: z.number().int().positive().optional(),
  ownerId: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  type: z.enum(TYPE_VALUES),
  createdAt: z.coerce.date().optional(),
});

export type Notification = z.infer<typeof notificationSchema>;
