import { z } from "zod";

import {
  PROPERTY_STATUS_VALUES,
  PROPERTY_TYPE_VALUES,
  AMENITY_VALUES,
} from "./FormSchemas";

export const locationSchema = z.object({
  country: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  address: z.string(),
  zipCode: z.string(),
});

export const propertySchema = z.object({
  id: z.string(),
  price: z.number(),
  imageRefs: z.array(z.string()).default([]),
  location: locationSchema,
  description: z.string(),
  size: z.string(),
  agentId: z.number().int().positive(),
  status: z.enum(PROPERTY_STATUS_VALUES).default("available"),
  type: z.enum(PROPERTY_TYPE_VALUES),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  amenities: z.array(z.enum(AMENITY_VALUES)).default([]),
});

export type Property = z.infer<typeof propertySchema>;
