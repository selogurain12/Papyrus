import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { characterRefSchema, eventRefSchema } from "./references.dto";
import { projectSchema } from "./projects.dto";

export const createObjectSchema = z.object({
  name: z.string().min(1).max(100),
  importance: z.enum(["low", "medium", "high"]).nullable().optional(),
  description: z.string().min(1).max(1000).nullable().optional(),
  appearance: z.string().min(1).max(1000).nullable().optional(),
  significance: z.string().min(1).max(1000).nullable().optional(),
  location: z.string().min(1).max(1000).nullable().optional(),
  type: z.string().min(1).max(100).nullable().optional(),
  history: z.string().min(1).max(1000).nullable().optional(),
  character: z
    .lazy(() => characterRefSchema)
    .array()
    .optional(),
  events: z
    .lazy(() => eventRefSchema)
    .array()
    .optional(),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional(),
  deletedAt: z.string().refine(isZonedIso8601).optional(),
  project: z.lazy(() => projectSchema),
});

export const objectSchema = createObjectSchema.extend({
  id: z.uuid("Le format de l'id de l'objet est invalide"),
});

export const updateObjectSchema = createObjectSchema.partial();

export type CreateObjectDto = z.infer<typeof createObjectSchema>;
export type UpdateObjectDto = z.infer<typeof updateObjectSchema>;
export type ObjectDto = z.infer<typeof objectSchema>;
