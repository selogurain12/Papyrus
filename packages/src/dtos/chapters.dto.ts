import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { projectSchema } from "./projects.dto";
import { partSchema } from "./parts.dto";

export const createChapterSchema = z.object({
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

export const chapterSchema = createChapterSchema.extend({
  id: z.uuid("Le format de l'id du chapitre est invalide"),
});

export const updateChapterSchema = createChapterSchema.partial();

export type CreateChapterDto = z.infer<typeof createChapterSchema>;
export type ChapterDto = z.infer<typeof chapterSchema>;
export type UpdateChapterDto = z.infer<typeof updateChapterSchema>;
