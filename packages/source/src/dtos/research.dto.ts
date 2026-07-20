import z from "zod";
import { reasearchTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createResearchSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Titre trop petit, minimum 1 caractère" })
    .max(100, { message: "Titre trop grand, maximum 100 caractères" }),
  type: z.enum(reasearchTypes),
  sources: z
    .string()
    .min(1, { message: "Source trop petite, minimum 1 caractère" })
    .max(1000, { message: "Source trop grande, maximum 1000 caractères" })
    .nullable()
    .optional(),
  tag: z.string().array().nullable(),
  note: z
    .string()
    .min(1, { message: "Note trop petite, minimum 1 caractère" })
    .max(1000, { message: "Note trop grande, maximum 1000 caractères" })
    .nullable()
    .optional(),
  description: z
    .string()
    .min(1, { message: "Description trop petite, minimum 1 caractère" })
    .max(1000, { message: "Description trop grande, maximum 1000 caractères" })
    .nullable(),
  link: z
    .string()
    .min(1, { message: "Lien trop petit, minimum 1 caractère" })
    .max(1000, { message: "Lien trop grand, maximum 1000 caractères" })
    .nullable()
    .optional(),
  project: z.lazy(() => projectSchema),
});

export const researchSchema = createResearchSchema.extend({
  id: z.string().uuid("Le format de l'id de la recherche est invalide"),
});

export const updateResearchSchema = createResearchSchema.partial();

export const filterResearchSchema = filterSchema.extend({
  type: z.enum(["articles", "links", "images", "videos", "books"]).optional(),
});

export type CreateResearchDto = z.infer<typeof createResearchSchema>;
export type ResearchDto = z.infer<typeof researchSchema>;
export type UpdateResearchDto = z.infer<typeof updateResearchSchema>;
export type FilterResearchDto = z.infer<typeof filterResearchSchema>;
