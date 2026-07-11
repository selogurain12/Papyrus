import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { projectSchema } from "./project.dto";

export const createHistorySchema = z.object({
  type: z.enum(["create", "update", "delete"]),
  entity: z.enum([
    "mindmap",
    "character",
    "place",
    "chapter",
    "part",
    "goal",
    "event",
    "export",
    "note",
    "object",
    "research",
  ]),
  date: z.string().refine(isZonedIso8601),
  title: z.string(),
  project: z.lazy(() => projectSchema),
});

export const historySchema = createHistorySchema.extend({
  id: z.string().uuid("Le format de l'id de l'historique est invalide"),
});

export type CreateHistoryDto = z.infer<typeof createHistorySchema>;
export type HistoryDto = z.infer<typeof historySchema>;
