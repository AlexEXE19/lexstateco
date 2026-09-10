import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string().min(1, "Message content cannot be empty"),
  createdAt: z.coerce.date(),
});

export type Message = z.infer<typeof MessageSchema>;
