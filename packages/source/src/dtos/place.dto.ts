import z from "zod";
import { languagesTypes } from "../utils/languages.enum";
import { projectSchema } from "./project.dto";

export const createPlaceSchema = z.object({
  name: z.string().min(1).max(100),
  nickname: z.string().min(1).max(100).optional().nullable(),
  type: z.string().array(),
  localisation: z.string(),
  physicalDescription: z.string().min(1).max(1000).optional().nullable(),
  atmosphere: z.string().min(1).max(1000).optional().nullable(),
  history: z.string().min(1).max(1000).optional().nullable(),
  population: z.string().min(1).max(1000).optional().nullable(),
  usages: z.string().min(1).max(1000).optional().nullable(),
  language: z.enum(languagesTypes).optional().nullable(),
  government: z.string().min(1).max(1000).optional().nullable(),
  ressources: z.string().min(1).max(1000).optional().nullable(),
  narrativeImportance: z.string().min(1).max(1000).optional().nullable(),
  project: z.lazy(() => projectSchema),
});

export const placeSchema = createPlaceSchema.extend({
  id: z.string().uuid("Le format de l'id de la partie est invalide"),
});

export const updatePlaceSchema = createPlaceSchema.partial();

export type CreatePlaceDto = z.infer<typeof createPlaceSchema>;
export type PlaceDto = z.infer<typeof placeSchema>;
export type UpdatePlaceDto = z.infer<typeof updatePlaceSchema>;
