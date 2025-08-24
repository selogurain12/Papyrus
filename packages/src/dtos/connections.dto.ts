import z from "zod";
import { brancheSchema } from "./branches.dto";

export const createConnectionSchema = z.object({
  branches: brancheSchema,
  name: z.string().min(2).max(100),
  relation: z.string().min(2).max(100),
  strength: z.enum(["strong", "average", "weak", "conflicting", "critical"]),
});

export const connectionSchema = createConnectionSchema.extend({
  id: z.uuid("Le format de l'id de la connexion est invalide"),
});

export const updateConnectionSchema = createConnectionSchema.partial();

export type CreateConnectionDto = z.infer<typeof createConnectionSchema>;
export type ConnectionDto = z.infer<typeof connectionSchema>;
export type UpdateConnectionDto = z.infer<typeof updateConnectionSchema>;
