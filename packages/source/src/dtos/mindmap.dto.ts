import z from "zod";
import { projectSchema } from "./project.dto";

export const createMindMapSchema = z.object({
  title: z.string().min(1).max(100),
  type: z.enum(["character", "location", "object", "event"]).default("character"),
  project: z.lazy(() => projectSchema),
});

export const mindMapSchema = createMindMapSchema.extend({
  id: z.string().uuid("Le format de l'id de la carte mentale est invalide"),
});

export const updateMindMapSchema = createMindMapSchema.partial();

export type CreateMindMapDto = z.infer<typeof createMindMapSchema>;
export type MindMapDto = z.infer<typeof mindMapSchema>;
export type UpdateMindMapDto = z.infer<typeof updateMindMapSchema>;
