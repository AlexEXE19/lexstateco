import { z } from "zod";

export const PROPERTY_STATUS_VALUES = ["available", "pending", "sold"];

export const PROPERTY_TYPE_VALUES = [
  "apartment",
  "villa",
  "penthouse",
  "studio",
  "townhouse",
  "bungalow",
  "cottage",
  "loft",
  "farmhouse",
  "treehouse",
  "houseboat",
  "chalet",
];

export const AMENITY_VALUES = [
  "swimmingPool",
  "garage",
  "garden",
  "fireplace",
  "homeGym",
  "sauna",
  "rooftopTerrace",
  "smartHomeSystem",
  "wineCellar",
  "homeCinema",
  "petFriendly",
  "elevator",
  "seaView",
  "mountainView",
  "solarPanels",
  "evCharger",
  "concierge",
  "coworkingSpace",
  "walkInCloset",
  "securitySystem",
];

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
  price: z.coerce.number().min(0),
  description: z.string().min(20, "Description must be at least 20 characters"),
  size: z.coerce.number().positive(),
  status: z.enum(PROPERTY_STATUS_VALUES),
  type: z.enum(PROPERTY_TYPE_VALUES),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  amenities: z.array(z.enum(AMENITY_VALUES)),
  location: z.object({
    country: z.string().min(1),
    city: z.string().min(1),
    neighborhood: z.string().min(1),
    address: z.string().min(1),
    zipCode: z.string().min(1),
  }),
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
