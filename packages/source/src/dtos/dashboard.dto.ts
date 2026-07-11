import z from "zod";
import { iconTypes } from "../utils/enum";

export const dashboardSummaryCardSchema = z.object({
  label: z.string(),
  value: z.string(),
  icon: z.enum(iconTypes),
  color: z.enum(["blue", "purple", "green", "orange"]),
  change: z.string(),
});

export const dashboardProgressSchema = z.object({
  label: z.string(),
  value: z.number().min(0),
  target: z.number().min(1),
  color: z.enum(["blue", "green", "purple", "orange"]),
});

export const dashboardWritingStreakSchema = z.object({
  days: z.number().min(0),
  message: z.string(),
  currentWordCount: z.number().min(0),
  targetWordCount: z.number().min(1),
  progress: z.number().min(0).max(100),
});

export const dashboardSchema = z.object({
  summaryCards: dashboardSummaryCardSchema.array(),
  progress: dashboardProgressSchema.array(),
  writingStreak: dashboardWritingStreakSchema,
});

export type DashboardSummaryCardDto = z.infer<typeof dashboardSummaryCardSchema>;
export type DashboardProgressDto = z.infer<typeof dashboardProgressSchema>;
export type DashboardWritingStreakDto = z.infer<typeof dashboardWritingStreakSchema>;
export type DashboardDto = z.infer<typeof dashboardSchema>;
