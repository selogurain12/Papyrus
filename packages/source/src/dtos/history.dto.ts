import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { entityTypes, historyType } from "../utils/enum";
import { projectSchema } from "./project.dto";

export const createHistorySchema = z.object({
  type: z.enum(historyType),
  entity: z.enum(entityTypes),
  date: z.string().refine(isZonedIso8601),
  title: z.string(),
  project: z.lazy(() => projectSchema),
});

export const historySchema = createHistorySchema.extend({
  id: z.string().uuid("Le format de l'id de l'historique est invalide"),
});

export type CreateHistoryDto = z.infer<typeof createHistorySchema>;
export type HistoryDto = z.infer<typeof historySchema>;
