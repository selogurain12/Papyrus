import z from "zod";
import { isZonedIso8601 } from "../utils/zoned-iso";
import { projectSchema } from "./project.dto";

export const createGoalSchema = z.object({
  type: z.enum(["daily", "weekly", "monthly", "project"]),
  title: z.string().min(2).max(100),
  goals: z.number().min(1),
  unit: z.enum(["words", "hours", "chapters"]),
  deadline: z.string().refine(isZonedIso8601).nullable().optional(),
  description: z.string().max(500).nullable(),
  status: z.enum(["warning", "urgent", "overdue"]).nullable().optional(),
  project: z.lazy(() => projectSchema),
});

export const goalSchema = createGoalSchema.extend({
  id: z.string().uuid("Le format de l'id du goal est invalide"),
});

export const updateGoalSchema = createGoalSchema.partial();

export type CreateGoalDto = z.infer<typeof createGoalSchema>;
export type GoalDto = z.infer<typeof goalSchema>;
export type UpdateGoalDto = z.infer<typeof updateGoalSchema>;
