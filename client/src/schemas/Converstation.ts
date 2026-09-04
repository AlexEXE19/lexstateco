import { z } from "zod";

export const conversationSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  buyerId: z.string(),
  agentId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Conversation = z.infer<typeof conversationSchema>;
