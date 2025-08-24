import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { projectSchema } from "./projects.dto";
import { objectSchema } from "./objects.dto";

export const createCharacterSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.enum(["protagonist", "antagonist", "ally", "mentor", "secondary character"]),
  description: z.string().optional().nullable(),
  age: z.number().min(0).optional().nullable(),
  appearance: z.string().optional().nullable(),
  personality: z.string().optional().nullable(),
  story: z.string().optional().nullable(),
  motivation: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  createdAt: z.string().refine(isZonedIso8601),
  updatedAt: z.string().refine(isZonedIso8601).optional(),
  deletedAt: z.string().refine(isZonedIso8601).optional(),
  project: z.lazy(() => projectSchema),
  objects: z.lazy(() => objectSchema).array(),
});

export const characterSchema = createCharacterSchema.extend({
  id: z.uuid("Le format de l'id du personnage est invalide"),
});

export const updateCharacterSchema = createCharacterSchema.partial();

export type CreateCharacterDto = z.infer<typeof createCharacterSchema>;
export type CharacterDto = z.infer<typeof characterSchema>;
export type UpdateCharacterDto = z.infer<typeof updateCharacterSchema>;
