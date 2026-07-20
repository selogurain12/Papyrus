import z from "zod";
import { colorTypes, importanceLevelTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createObjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nom trop petit, minimum 1 caractère" })
    .max(100, { message: "Nom trop grand, maximum 100 caractères" }),
  importance: z.enum(importanceLevelTypes),
  description: z
    .string()
    .min(1, { message: "Descritpion trop petite, minimum 1 caractère" })
    .max(1000, { message: "Descritpion trop grande, maximum 1000 caractères" })
    .nullable(),
  appearance: z
    .string()
    .min(1, { message: "Apparence trop petite, minimum 1 caractère" })
    .max(1000, { message: "Apparence trop grande, maximum 1000 caractères" })
    .nullable(),
  significance: z
    .string()
    .min(1, { message: "Signification trop petite, minimum 1 caractère" })
    .max(1000, { message: "Signification trop grande, maximum 1000 caractères" })
    .nullable(),
  location: z
    .string()
    .min(1, { message: "Localisation trop petite, minimum 1 caractère" })
    .max(1000, { message: "Localisation trop grande, maximum 1000 caractères" })
    .nullable(),
  type: z
    .string()
    .min(1, { message: "Type trop petit, minimum 1 caractère" })
    .max(100, { message: "Type trop grand, maximum 100 caractères" })
    .nullable(),
  history: z
    .string()
    .min(1, { message: "Histoire trop petite, minimum 1 caractère" })
    .max(1000, { message: "Histoire trop grande, maximum 1000 caractères" })
    .nullable(),
  color: z.enum(colorTypes).nullable(),
  avatarLink: z.string().nullable().optional(),
  project: z.lazy(() => projectSchema),
});

export const objectSchema = createObjectSchema.extend({
  id: z.string().uuid("Le format de l'id de l'objet est invalide"),
});

export const updateObjectSchema = createObjectSchema.partial();

export const filterObjectSchema = filterSchema.extend({
  importance: z.enum(["low", "medium", "high"]).array().optional(),
  characters: z.string().uuid("Le format de l'id du personnage est invalide").array().optional(),
  events: z.string().uuid("Le format de l'id de l'événement est invalide").array().optional(),
});

export type CreateObjectDto = z.infer<typeof createObjectSchema>;
export type UpdateObjectDto = z.infer<typeof updateObjectSchema>;
export type ObjectDto = z.infer<typeof objectSchema>;
export type FilterObjectDto = z.infer<typeof filterObjectSchema>;
