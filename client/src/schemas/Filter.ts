import { z } from "zod";

export const filterSchema = z.object({
  location: z.string(),
  minPrice: z.string(),
  maxPrice: z.string(),
  neighborhood: z.string(),
});

export type Filter = z.infer<typeof filterSchema>;
