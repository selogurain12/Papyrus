import z from "zod";
import { mindMapSchema } from "./mindmaps.dto";

export const createBrancheSchema = z.object({
  color: z.string(),
  title: z.string(),
  mindMap: z.lazy(() => mindMapSchema),
});

export const brancheSchema = createBrancheSchema.extend({
  id: z.uuid("Le format de l'id de la branche est invalide"),
});

export const updateBrancheSchema = createBrancheSchema.partial();

export type CreateBrancheDto = z.infer<typeof createBrancheSchema>;
export type BrancheDto = z.infer<typeof brancheSchema>;
export type UpdateBrancheDto = z.infer<typeof updateBrancheSchema>;
