import z from "zod";
import { statusTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";
import { partSchema } from "./part.dto";

export const createChapterSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Titre trop petit, minimum 2 caractères" })
    .max(100, { message: "Titre trop grand, maximum 100 caractères" }),
  status: z.enum(statusTypes).default("toStart"),
  content: z.string().nullable(),
  resume: z.string().nullable(),
  chapterNumber: z.number(),
  wordCount: z.number().default(0),
  wordGoal: z.number().default(500),
  project: z.lazy(() => projectSchema),
  part: z
    .lazy(() => partSchema)
    .nullable()
    .optional(),
});

export const chapterSchema = createChapterSchema.extend({
  id: z.string().uuid("Le format de l'id du chapitre est invalide"),
});

export const updateChapterSchema = createChapterSchema.partial();

export type CreateChapterDto = z.infer<typeof createChapterSchema>;
export type ChapterDto = z.infer<typeof chapterSchema>;
export type UpdateChapterDto = z.infer<typeof updateChapterSchema>;
