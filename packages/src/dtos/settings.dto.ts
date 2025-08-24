import z from "zod";
import { languagesTypes } from "../utils/languages.enum";

export const createSettingSchema = z.object({
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

export const settingSchema = createSettingSchema.extend({
  id: z.uuid("Invalid setting ID format"),
});

export const updateSettingSchema = createSettingSchema.partial();

export type CreateSettingDto = z.infer<typeof createSettingSchema>;
export type SettingDto = z.infer<typeof settingSchema>;
export type UpdatedSettingDto = z.infer<typeof updateSettingSchema>;
