import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { projectSchema } from "./projects.dto";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000).nullable(),
  tags: z.string().array(),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional(),
  deletedAt: z.string().refine(isZonedIso8601).optional(),
  project: projectSchema,
});

export const noteSchema = createNoteSchema.extend({
  id: z.uuid("Le format de l'id de la note est invalide"),
});

export const updateNoteSchema = createNoteSchema.partial();

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type NoteDto = z.infer<typeof noteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
