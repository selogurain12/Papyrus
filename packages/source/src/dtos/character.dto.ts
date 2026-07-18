import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { colorTypes, genderTypes, roleTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";
import { filterSchema } from "./filter.dto";

export const createCharacterSchema = z.object({
  role: z.enum(roleTypes),
  roleStar: z.number().min(0),

  // état civil
  firstName: z
    .string()
    .min(1, { message: "Prénom trop petit, minimum 1 caractère" })
    .max(100, { message: "Prénom trop grand, maximum 100 caractères" }),
  lastName: z
    .string()
    .min(1, { message: "Nom de famille trop petit, minimum 1 caractère" })
    .max(100, { message: "Nom de famille trop grand, maximum 100 caractères" }),
  nickName: z
    .string()
    .min(1, { message: "Surnom trop petit, minimum 1 caractère" })
    .max(100, { message: "Surnom trop grand, maximum 100 caractères" }),
  pronouns: z
    .string()
    .min(1, { message: "Pronom trop petit, minimum 1 caractère" })
    .max(50, { message: "Pronom trop grand, maximum 50 caractères" }),
  gender: z.enum(genderTypes),
  nationality: z
    .string()
    .max(100, { message: "Nationalité trop grande, maximum 100 caractères" })
    .nullable(),
  age: z.number().min(0, { message: "Age minimum de 0" }).nullable(),
  birthDate: z.string().refine(isZonedIso8601).nullable(),
  birthPlace: z
    .string()
    .max(150, { message: "Lieu de naissance trop grand, maximum 100 caractères" })
    .nullable(),
  residencePlace: z
    .string()
    .max(150, { message: "Lieu de résidence trop grand, maximum 150 caractères" })
    .nullable(),
  occupation: z
    .string()
    .max(150, { message: "Loisirs trop grand, maximum 150 caractères" })
    .nullable(),

  // physique
  height: z.number().min(0, { message: "Taille trop petite, minimum 0" }).nullable(),
  weight: z.number().min(0, { message: "Poids trop petit, minimum 0" }).nullable(),
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
  class: z.string().nullable(),
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
