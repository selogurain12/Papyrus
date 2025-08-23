import z from "zod";
import { mindMapSchema } from "./mindmap.dto";

export const createBranchesSchema = z.object({
  color: z.string(),
  title: z.string(),
  mindMap: z.lazy(() => mindMapSchema),
});

export const branchesSchema = createBranchesSchema.extend({
  id: z.uuid("Le format de l'id de la branche est invalide"),
});

export const updatedBranchesSchema = createBranchesSchema.partial();

export type CreateBranchesDto = z.infer<typeof createBranchesSchema>;
export type BranchesDto = z.infer<typeof branchesSchema>;
export type UpdateBranchesDto = z.infer<typeof updatedBranchesSchema>;
