import z from "zod";
import { statusTypes } from "../utils/enum";
import { projectSchema } from "./project.dto";

export const createPartSchema = z.object({
  title: z.string().min(1).max(100),
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
