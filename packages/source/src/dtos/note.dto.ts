import z from "zod";
import { projectSchema } from "./project.dto";

export const createNoteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000).nullable(),
  tags: z.string().array().nullable(),
  project: projectSchema,
});

export const noteSchema = createNoteSchema.extend({
  id: z.string().uuid("Le format de l'id de la note est invalide"),
});

export const updateNoteSchema = createNoteSchema.partial();

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
export type NoteDto = z.infer<typeof noteSchema>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
