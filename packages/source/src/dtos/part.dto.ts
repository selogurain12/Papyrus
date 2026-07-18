import z from "zod";
import { statusTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";

export const createPartSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Titre trop petit, minimum 1 caractère" })
    .max(100, { message: "Titre trop grand, maximum 100 caractères" }),
  status: z.enum(statusTypes).default("toStart"),
  project: z.lazy(() => projectSchema),
});

export const partSchema = createPartSchema.extend({
  id: z.string().uuid("Le format de l'id de la partie est invalide"),
});

export const updatePartSchema = createPartSchema.partial();

export type CreatePartDto = z.infer<typeof createPartSchema>;
export type UpdatePartDto = z.infer<typeof updatePartSchema>;
export type PartDto = z.infer<typeof partSchema>;
