import z from "zod";
import { characterSchema } from "./characters.dto";
import { projectSchema } from "./projects.dto";
import { placeSchema } from "./places.dto";
import { objectSchema } from "./objects.dto";
import { eventSchema } from "./event.dto";

export const createMindMapSchema = z.object({
  title: z.string().min(1).max(100),
  type: z.enum(["character", "location", "object", "event"]).default("character"),
  characterCenter: z.lazy(() => characterSchema),
  placeCenter: z.lazy(() => placeSchema),
  objectCenter: z.lazy(() => objectSchema),
  eventCenter: z.lazy(() => eventSchema),
  project: z.lazy(() => projectSchema),
});

export const mindMapSchema = createMindMapSchema.extend({
  id: z.uuid("Le format de l'id de la carte mentale est invalide"),
});

export const updateMindMapSchema = createMindMapSchema.partial();

export type CreateMindMapDto = z.infer<typeof createMindMapSchema>;
export type MindMapDto = z.infer<typeof mindMapSchema>;
export type UpdateMindMapDto = z.infer<typeof updateMindMapSchema>;
