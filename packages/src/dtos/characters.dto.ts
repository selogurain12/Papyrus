import { isZonedIso8601 } from "utils/zoned-iso";
import z from "zod";
import { projectSchema } from "./projects.dto";
import { objectSchema } from "./objects.dto";

export const createCharactersSchema = z.object({
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

export const characterSchema = createCharactersSchema.extend({
  id: z.uuid("Le format de l'id du personnage est invalide"),
});

export const updatedCharactersSchema = createCharactersSchema.partial();

export type CreateCharactersDto = z.infer<typeof createCharactersSchema>;
export type CharacterDto = z.infer<typeof characterSchema>;
export type UpdateCharactersDto = z.infer<typeof updatedCharactersSchema>;
