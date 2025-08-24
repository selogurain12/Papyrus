import z from "zod";
import { projectSchema } from "./projects.dto";

export const createArchitectureSchema = z.object({
  firstIdea: z.string().nullable(),
  plan: z.string().nullable(),
  environnement: z.string().nullable(),
  project: z.lazy(() => projectSchema),
});

export const architectureSchema = createArchitectureSchema.extend({
  id: z.uuid("Le format de l'id de l'architecture est invalide"),
});

export const updateArchitectureSchema = createArchitectureSchema.partial();

export type CreateArchitectureDto = z.infer<typeof createArchitectureSchema>;
export type UpdateArchitectureDto = z.infer<typeof updateArchitectureSchema>;
export type ArchitectureDto = z.infer<typeof architectureSchema>;
