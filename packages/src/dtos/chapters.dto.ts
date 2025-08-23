import { isZonedIso8601 } from "utils/zoned-iso";
import z from "zod";
import { projectSchema } from "./projects.dto";
import { partSchema } from "./parts.dto";

export const createChaptersSchema = z.object({
  title: z.string().min(2).max(100),
  status: z.enum(["toStart", "inProgress", "completed"]).default("toStart"),
  content: z.string().nullable(),
  chapterNumber: z.number(),
  wordCount: z.number().default(0),
  wordGoal: z.number().default(500),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional(),
  deletedAt: z.string().refine(isZonedIso8601).optional(),
  project: z.lazy(() => projectSchema),
  part: z.lazy(() => partSchema),
});

export const chapterSchema = createChaptersSchema.extend({
  id: z.uuid("Le format de l'id du chapitre est invalide"),
});

export const updatedChaptersSchema = createChaptersSchema.partial();

export type CreateChaptersDto = z.infer<typeof createChaptersSchema>;
export type ChapterDto = z.infer<typeof chapterSchema>;
export type UpdateChaptersDto = z.infer<typeof updatedChaptersSchema>;
