import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.email().toLowerCase(),
  password: z.string().min(8),
  phone: z.e164(),
});

export type LoginFormFields = z.infer<typeof loginSchema>;
export type RegisterFormFields = z.infer<typeof registerSchema>;
