import { z } from "zod";
import { propertySchema } from "../property/Property";

export const conversationSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  buyerId: z.string(),
  agentId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const conversationWithPropertySchema = conversationSchema.extend({
  Property: propertySchema,
});

export type Conversation = z.infer<typeof conversationSchema>;
export type ConversationWithProperty = z.infer<
  typeof conversationWithPropertySchema
>;
