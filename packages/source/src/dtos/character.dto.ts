import z from "zod";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createCharacterSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.enum(["protagonist", "antagonist", "ally", "mentor", "secondary character"]),
  description: z.string().nullable(),
  age: z.number().min(0).nullable(),
  appearance: z.string().nullable(),
  personality: z.string().nullable(),
  story: z.string().nullable(),
  motivation: z.string().nullable(),
  color: z.string().nullable(),
  project: z.lazy(() => projectSchema),
});

export const characterSchema = createCharacterSchema.extend({
  id: z.string().uuid("Le format de l'id du personnage est invalide"),
});

export const updateCharacterSchema = createCharacterSchema.partial();

export const filterCharacterSchema = filterSchema.extend({
  role: z
    .enum(["protagonist", "antagonist", "ally", "mentor", "secondary character"])
    .array()
    .optional(),
  minAge: z.number().min(0).optional(),
  maxAge: z.number().min(0).optional(),
  objects: z.string().uuid("Le format de l'id de l'objet est invalide").array().optional(),
  events: z.string().uuid("Le format de l'id de l'événement est invalide").array().optional(),
});

export type CreateCharacterDto = z.infer<typeof createCharacterSchema>;
export type CharacterDto = z.infer<typeof characterSchema>;
export type UpdateCharacterDto = z.infer<typeof updateCharacterSchema>;
export type FilterCharacterDto = z.infer<typeof filterCharacterSchema>;
