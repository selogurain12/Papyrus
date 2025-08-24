import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { projectSchema } from "./projects.dto";

export const createResearchSchema = z.object({
  title: z.string().min(1).max(100),
  type: z.enum(["articles", "links", "images", "videos", "books"]),
  sources: z.string().min(1).max(1000).optional().nullable(),
  tag: z.string().array().optional().nullable(),
  note: z.string().min(1).max(1000).optional().nullable(),
  link: z.string().min(1).max(1000).optional().nullable(),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional().nullable(),
  deletedAt: z.string().refine(isZonedIso8601).optional().nullable(),
  project: z.lazy(() => projectSchema),
});

export const researchSchema = createResearchSchema.extend({
  id: z.uuid("Le format de l'id de la recherche est invalide"),
});

export const updateResearchSchema = createResearchSchema.partial();

export type CreateResearchDto = z.infer<typeof createResearchSchema>;
export type ResearchDto = z.infer<typeof researchSchema>;
export type UpdateResearchDto = z.infer<typeof updateResearchSchema>;
