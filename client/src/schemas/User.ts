import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  password: z.string(),
  phone: z.string(),
  feedbackRating: z.number().int().min(1).max(5).optional().nullable(),
});

export type User = z.infer<typeof userSchema>;
