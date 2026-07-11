import z from "zod";
import { fontFamilyTypes, fontSizeTypes, languagesTypes } from "../utils/enum";

export const settingShortcutSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  shortcut: z.string().min(1),
});

export const createSettingSchema = z.object({
  language: z.enum(languagesTypes),
  autoSave: z.boolean().default(true),
  autoSaveInterval: z.number().default(5),
  dailyWordCountGoal: z.number().default(1000),
  theme: z.enum(["light", "dark"]).default("light"),
  compactMode: z.boolean().default(false),
  fontSize: z.enum(fontSizeTypes).default("medium"),
  fontFamily: z.enum(fontFamilyTypes).default("system"),
  showLineNumbers: z.boolean().default(false),
  focusMode: z.boolean().default(true),
  spellcheck: z.boolean().default(true),
  shortcuts: z.array(settingShortcutSchema).default([]),
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
  id: z.string().uuid("Invalid setting ID format"),
});

export const updateSettingSchema = createSettingSchema.partial();

export type CreateSettingDto = z.infer<typeof createSettingSchema>;
export type SettingDto = z.infer<typeof settingSchema>;
export type UpdatedSettingDto = z.infer<typeof updateSettingSchema>;
export type SettingShortcutDto = z.infer<typeof settingShortcutSchema>;
