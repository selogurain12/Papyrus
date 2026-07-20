import z from "zod";
import { colorTypes, importanceLevelTypes, languagesTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";

export const createPlaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nom trop petit, minimum 1 caractère" })
    .max(100, { message: "Nom trop grand, maximum 100 caractères" }),
  nickname: z
    .string()
    .min(1, { message: "Surnom trop petit, minimum 1 caractère" })
    .max(100, { message: "Surnom trop grand, maximum 100 caractères" })
    .optional()
    .nullable(),
  type: z.string(),
  localisation: z.string(),
  physicalDescription: z
    .string()
    .min(1, { message: "Description physique trop petite, minimum 1 caractère" })
    .max(1000, { message: "Description physique trop grande, maximum 1000 caractères" })
    .optional()
    .nullable(),
  atmosphere: z
    .string()
    .min(1, { message: "Atmosphère trop petite, minimum 1 caractère" })
    .max(1000, { message: "Atmosphère trop grande, maximum 1000 caractères" })
    .optional()
    .nullable(),
  history: z
    .string()
    .min(1, { message: "Histoire trop petite, minimum 1 caractère" })
    .max(1000, { message: "Histoire trop grande, maximum 1000 caractères" })
    .optional()
    .nullable(),
  population: z
    .string()
    .min(1, { message: "Population trop petit, minimum 1 caractère" })
    .max(1000, { message: "Population trop grand, maximum 1000 caractères" })
    .optional()
    .nullable(),
  usages: z
    .string()
    .min(1, { message: "Usage trop petit, minimum 1 caractère" })
    .max(1000, { message: "Population trop grand, maximum 1000 caractères" })
    .optional()
    .nullable(),
  language: z.enum(languagesTypes).optional().nullable(),
  government: z
    .string()
    .min(1, { message: "Gouvernement trop petit, minimum 1 caractère" })
    .max(1000, { message: "Gouvernement trop grand, maximum 1000 caractères" })
    .optional()
    .nullable(),
  ressources: z
    .string()
    .min(1, { message: "Ressources trop petite, minimum 1 caractère" })
    .max(1000, { message: "Ressources trop grande, maximum 1000 caractères" })
    .optional()
    .nullable(),
  narrativeImportance: z.enum(importanceLevelTypes),
  color: z.enum(colorTypes),
  avatarLink: z.string().nullable().optional(),
  project: z.lazy(() => projectSchema),
});

export const placeSchema = createPlaceSchema.extend({
  id: z.string().uuid("Le format de l'id de la partie est invalide"),
});

export const updatePlaceSchema = createPlaceSchema.partial();

export type CreatePlaceDto = z.infer<typeof createPlaceSchema>;
export type PlaceDto = z.infer<typeof placeSchema>;
export type UpdatePlaceDto = z.infer<typeof updatePlaceSchema>;
