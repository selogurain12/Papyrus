import z from "zod";
import { reasearchTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createResearchSchema = z.object({
  title: z.string().min(1).max(100),
  type: z.enum(reasearchTypes),
  sources: z.string().min(1).max(1000).nullable().optional(),
  tag: z.string().array().nullable(),
  note: z.string().min(1).max(1000).nullable().optional(),
  description: z.string().min(1).max(1000).nullable(),
  link: z.string().min(1).max(1000).nullable().optional(),
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
