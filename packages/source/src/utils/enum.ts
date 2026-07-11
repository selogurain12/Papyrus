export const languagesTypes = [
  "fr",
  "en",
  "es",
  "de",
  "it",
  "pt",
  "ru",
  "zh",
  "ja",
  "ko",
  "cs",
] as const;

export const statusTypes = ["toStart", "inProgress", "completed"] as const;

export const roleTypes = [
  "protagonist",
  "antagonist",
  "ally",
  "mentor",
  "secondary character",
] as const;

export const genderTypes = ["female", "male", "other"] as const;

export const colorTypes = [
  "green",
  "blue",
  "purple",
  "red",
  "yellow",
  "pink",
  "orange",
  "gray",
  "cyan",
] as const;

export const iconTypes = ["bookOpen", "users", "mapPin", "calendar"] as const;

export const importanceTypes = ["critical", "important", "action", "normal"] as const;

export const goalTypes = ["daily", "weekly", "monthly", "project"] as const;

export const goalStatusTypes = ["warning", "urgent", "overdue"] as const;

export const entityTypes = [
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
] as const;

export const historyType = ["create", "update", "delete"] as const;

export const importanceLevelTypes = ["high", "medium", "low"] as const;

export const projectStatusTypes = ["planning", "writing", "editing", "completed"] as const;

export const reasearchTypes = ["articles", "links", "images", "videos", "books"] as const;

export const fontSizeTypes = ["small", "medium", "large", "xlarge"] as const;

export const fontFamilyTypes = ["system", "lora", "merriweather", "source-serif-4"] as const;

export type LanguageType = (typeof languagesTypes)[number];
export type StatusType = (typeof statusTypes)[number];
export type RoleType = (typeof roleTypes)[number];
export type GenderType = (typeof genderTypes)[number];
export type ColorType = (typeof colorTypes)[number];
export type IconType = (typeof iconTypes)[number];
export type ImportanceType = (typeof importanceTypes)[number];
export type GoalType = (typeof goalTypes)[number];
export type GoalStatusType = (typeof goalStatusTypes)[number];
export type EntityType = (typeof entityTypes)[number];
export type HistoryType = (typeof historyType)[number];
export type ImportanceLevelType = (typeof importanceLevelTypes)[number];
export type ProjectStatusType = (typeof projectStatusTypes)[number];
export type ResearchType = (typeof reasearchTypes)[number];
export type FontSizeType = (typeof fontSizeTypes)[number];
export type FontFamilyType = (typeof fontFamilyTypes)[number];
