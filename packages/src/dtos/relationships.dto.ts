import z from "zod";
import { characterSchema } from "./characters.dto";

export const createRelationshipsSchema = z.object({
  parentRelation: z.lazy(() => characterSchema),
  childRelation: z.lazy(() => characterSchema),
  type: z.string().min(1).max(50),
});

export const relationshipsSchema = createRelationshipsSchema.extend({
  id: z.uuid("Le format de l'id de la relation est invalide"),
});

export const updateRelationshipsSchema = createRelationshipsSchema.partial();

export type CreateRelationshipsDto = z.infer<typeof createRelationshipsSchema>;
export type RelationshipsDto = z.infer<typeof relationshipsSchema>;
export type UpdateRelationshipsDto = z.infer<typeof updateRelationshipsSchema>;
