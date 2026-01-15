import z from "zod";
import { characterSchema } from "./character.dto";
import { projectSchema } from "./project.dto";

export const createRelationshipSchema = z.object({
  parentRelation: z.lazy(() => characterSchema),
  childRelation: z.lazy(() => characterSchema),
  type: z.string().min(1).max(50),
  project: z.lazy(() => projectSchema),
});

export const relationshipSchema = createRelationshipSchema.extend({
  id: z.string().uuid("Le format de l'id de la relation est invalide"),
});

export const updateRelationshipSchema = createRelationshipSchema.partial();

export type CreateRelationshipDto = z.infer<typeof createRelationshipSchema>;
export type RelationshipDto = z.infer<typeof relationshipSchema>;
export type UpdateRelationshipDto = z.infer<typeof updateRelationshipSchema>;
