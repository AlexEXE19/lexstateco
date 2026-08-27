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

export const propertyListingSchema = z.object({
  title: z.string().trim().min(1),
  price: z.coerce.number().positive(),
  location: z.string().trim().min(1),
  neighborhood: z.string().trim().min(1),
  zipCode: z.string().trim().min(1),
  description: z.string().trim().min(1),
  size: z.coerce.number().positive(),
});

// Every field here is optional - an empty filter just means "show
// everything," same as GET /properties with no query params at all. The
// light regex checks exist so a stray non-numeric paste into a price field
// gets caught before it's sent, not to make filtering mandatory.
export const propertyFilterSchema = z.object({
  location: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  minPrice: z
    .string()
    .trim()
    .regex(/^\d+$/, "Numbers only")
    .optional()
    .or(z.literal("")),
  maxPrice: z
    .string()
    .trim()
    .regex(/^\d+$/, "Numbers only")
    .optional()
    .or(z.literal("")),
});

export type LoginFormFields = z.infer<typeof loginSchema>;
export type RegisterFormFields = z.infer<typeof registerSchema>;
export type PropertyFilterFormFields = z.infer<typeof propertyFilterSchema>;

// price/size go through z.coerce.number(), so what react-hook-form holds
// while the user is typing (input, still a string) differs from what the
// resolver hands the submit callback after validation (output, a number).
export type PropertyListingFormInput = z.input<typeof propertyListingSchema>;
export type PropertyListingFormFields = z.output<typeof propertyListingSchema>;
