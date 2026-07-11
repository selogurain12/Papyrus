import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { colorTypes, genderTypes, roleTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createCharacterSchema = z.object({
  role: z.enum(roleTypes),
  roleStar: z.number().min(0),

  // état civil
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  nickName: z.string().min(1).max(100),
  pronouns: z.string().min(1).max(50),
  gender: z.enum(genderTypes),
  nationality: z.string().max(100).nullable(),
  age: z.number().min(0).nullable(),
  birthDate: z.string().refine(isZonedIso8601).nullable(),
  birthPlace: z.string().max(150).nullable(),
  residencePlace: z.string().max(150).nullable(),
  occupation: z.string().max(150).nullable(),

  // physique
  height: z.number().min(0).nullable(),
  weight: z.number().min(0).nullable(),
  corpulence: z.string().nullable(),
  hairColor: z.string().nullable(),
  eyesColor: z.string().nullable(),
  voice: z.string().nullable(),
  outfit: z.string().nullable(),
  accessory: z.string().nullable(),
  description: z.string().nullable(),

  // caractère
  characterQualities: z.array(z.string()).nullable(),
  characterFlaws: z.array(z.string()).nullable(),
  tastes: z.string().nullable(),
  tics: z.string().nullable(),
  fears: z.string().nullable(),

  // profil
  education: z.string().nullable(),
  richesses: z.number().min(0).nullable(),
  belief: z.string().nullable(),
  secrets: z.string().nullable(),
  notablePlaces: z.string().nullable(),
  typicalExpression: z.string().nullable(),

  // évolution
  goals: z.string().nullable(),
  past: z.string().nullable(),
  present: z.string().nullable(),
  future: z.string().nullable(),

  // autre
  notes: z.string().nullable(),
  color: z.enum(colorTypes).nullable(),

  project: z.lazy(() => projectSchema),
});

export const characterSchema = createCharacterSchema.extend({
  id: z.string().uuid("Le format de l'id du personnage est invalide"),
});

export const updateCharacterSchema = createCharacterSchema.partial();

export const filterCharacterSchema = filterSchema.extend({
  role: z.enum(roleTypes).array().optional(),
  minAge: z.number().min(0).optional(),
  maxAge: z.number().min(0).optional(),
  objects: z.string().uuid("Le format de l'id de l'objet est invalide").array().optional(),
  events: z.string().uuid("Le format de l'id de l'événement est invalide").array().optional(),
});

export type CreateCharacterDto = z.infer<typeof createCharacterSchema>;
export type CharacterDto = z.infer<typeof characterSchema>;
export type UpdateCharacterDto = z.infer<typeof updateCharacterSchema>;
export type FilterCharacterDto = z.infer<typeof filterCharacterSchema>;
