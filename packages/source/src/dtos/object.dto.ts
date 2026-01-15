import z from "zod";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createObjectSchema = z.object({
  name: z.string().min(1).max(100),
  importance: z.enum(["low", "medium", "high"]).nullable(),
  description: z.string().min(1).max(1000).nullable(),
  appearance: z.string().min(1).max(1000).nullable(),
  significance: z.string().min(1).max(1000).nullable(),
  location: z.string().min(1).max(1000).nullable(),
  type: z.string().min(1).max(100).nullable(),
  history: z.string().min(1).max(1000).nullable(),
  color: z.string().min(1).nullable(),
  project: z.lazy(() => projectSchema),
});

export const objectSchema = createObjectSchema.extend({
  id: z.string().uuid("Le format de l'id de l'objet est invalide"),
});

export const updateObjectSchema = createObjectSchema.partial();

export const filterObjectSchema = filterSchema.extend({
  importance: z.enum(["low", "medium", "high"]).array().optional(),
  characters: z.string().uuid("Le format de l'id du personnage est invalide").array().optional(),
  events: z.string().uuid("Le format de l'id de l'événement est invalide").array().optional(),
});

export type CreateObjectDto = z.infer<typeof createObjectSchema>;
export type UpdateObjectDto = z.infer<typeof updateObjectSchema>;
export type ObjectDto = z.infer<typeof objectSchema>;
export type FilterObjectDto = z.infer<typeof filterObjectSchema>;
