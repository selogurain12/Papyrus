import z from "zod";
import { languagesTypes } from "../utils/languages.enum";

export const createSettingsSchema = z.object({
  language: languagesTypes,
  autoSave: z.boolean().default(true),
  autoSaveInterval: z.number().default(5),
  dailyWordCountGoal: z.number().default(1000),
  theme: z.enum(["light", "dark"]).default("light"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  fontFamily: z.enum(["system", "serif", "sans-serif"]).default("system"),
  enableNotifications: z.boolean().default(true),
  dailyReminder: z.boolean().default(true),
  goalReminder: z.boolean().default(true),
  backupReminder: z.boolean().default(true),
  enableAutoBackup: z.boolean().default(true),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  exportFormat: z.enum(["json", "txt", "pdf", "docx"]).default("json"),
  showStatistics: z.boolean().default(true),
  trackWritingTime: z.boolean().default(true),
  saveHistory: z.boolean().default(true),
});

export const settingsSchema = createSettingsSchema.extend({
  id: z.uuid("Invalid settings ID format"),
});

export const updatedSettingsSchema = createSettingsSchema.partial();

export type CreateProjetcDto = z.infer<typeof createSettingsSchema>;
export type SettingsDto = z.infer<typeof settingsSchema>;
export type UpdatedSettingsDto = z.infer<typeof updatedSettingsSchema>;
