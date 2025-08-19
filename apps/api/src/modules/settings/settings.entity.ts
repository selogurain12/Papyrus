import { randomUUID } from "node:crypto";
import { Entity, PrimaryKey, Property, UuidType } from "@mikro-orm/postgresql";
import { LanguageType } from "@papyrus/source";

@Entity()
export class Settings {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string", default: "fr" })
  public language: LanguageType = "fr";

  @Property({ type: "boolean", default: true })
  public autoSave: boolean = true;

  @Property({ type: "number", default: 5 })
  public autoSaveInterval: number = 5;

  @Property({ type: "number", default: 1000 })
  public dailyWordCountGoal: number = 1000;

  @Property({ type: "string", default: "light" })
  public theme: "light" | "dark" = "light";

  @Property({ type: "string", default: "medium" })
  public fontSize: "small" | "medium" | "large" = "medium";

  @Property({ type: "string", default: "system" })
  public fontFamily: "system" | "serif" | "sans-serif" = "system";

  @Property({ type: "boolean", default: true })
  public enableNotifications: boolean = true;

  @Property({ type: "boolean", default: true })
  public dailyReminder: boolean = true;

  @Property({ type: "boolean", default: true })
  public goalReminder: boolean = true;

  @Property({ type: "boolean", default: true })
  public backupReminder: boolean = true;

  @Property({ type: "boolean", default: true })
  public enableAutoBackup: boolean = true;

  @Property({ type: "string", default: "daily" })
  public backupFrequency: "daily" | "weekly" | "monthly" = "daily";

  @Property({ type: "string", default: "json" })
  public exportFormat: "json" | "txt" | "pdf" | "docx" = "json";

  @Property({ type: "boolean", default: true })
  public showStatistics: boolean = true;

  @Property({ type: "boolean", default: true })
  public trackWritingTime: boolean = true;

  @Property({ type: "boolean", default: true })
  public saveHistory: boolean = true;
}
