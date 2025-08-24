import z from "zod";
import { languagesTypes } from "../utils/languages.enum";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { settingSchema } from "./settings.dto";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre du projet est requis")
    .max(100, "Le titre du projet ne peut pas dépasser 100 caractères"),
  description: z.string().max(500, "La description du projet ne peut pas dépasser").optional(),
  genre: z
    .string()
    .min(1, "Le genre du projet est requis")
    .max(50, "Le genre du projet ne peut pas dépasser 50 caractères"),
  targetWordCount: z
    .number()
    .int()
    .min(0, "Le nombre de mots cible doit être un entier positif")
    .default(100000),
  currentWordCount: z
    .number()
    .int()
    .min(0, "Le nombre de mots actuel doit être un entier positif")
    .default(0),
  status: z.enum(["planning", "writing", "editing", "completed"]).default("planning"),
  author: z
    .string()
    .min(1, "L'auteur du projet est requis")
    .max(50, "Le nom de l'auteur ne peut pas dépasser 50 caractères"),
  language: languagesTypes,
  tags: z.array(z.string()).max(10, "Le nombre maximum de tags est 10").optional(),
  settings: z.lazy(() => settingSchema),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional(),
  deletedAt: z.string().refine(isZonedIso8601).optional(),
});

export const projectSchema = createProjectSchema.extend({
  id: z.uuid("Le format de l'id du projet est invalide"),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type ProjectDto = z.infer<typeof projectSchema>;
export type UpdatedProjectDto = z.infer<typeof updateProjectSchema>;
