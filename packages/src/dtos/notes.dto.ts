import { isZonedIso8601 } from "utils/zoned-iso";
import z from "zod";
import { projectSchema } from "./projects.dto";

export const createNotesSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000).nullable(),
  tags: z.string().array(),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional(),
  deletedAt: z.string().refine(isZonedIso8601).optional(),
  project: projectSchema,
});

export const notesSchema = createNotesSchema.extend({
  id: z.uuid("Le format de l'id de la note est invalide"),
});

export const updatedNotesSchema = createNotesSchema.partial();

export type CreateNotesDto = z.infer<typeof createNotesSchema>;
export type NotesDto = z.infer<typeof notesSchema>;
export type UpdateNotesDto = z.infer<typeof updatedNotesSchema>;
