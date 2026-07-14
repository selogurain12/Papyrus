import { createGoalSchema, updateGoalSchema } from "../../../packages/source/src/dtos/goal.dto";

const project = {
  id: "41f083b5-e61d-44c2-8b2e-8fa1637fe68f",
  title: "Papyrus",
  description: null,
  genre: "roman",
  author: "Lora",
  language: "fr",
  deadline: null,
  currentWordCount: 0,
  targetWordCount: 100000,
  status: "planning",
  tags: [],
  user: {
    id: "b8f1f9f4-6c83-4d8f-84ed-5cb2ca0bca11",
    firstName: "Lora",
    lastName: "Seguin",
    email: "lora@example.com",
    password: "hashed-password",
    createdAt: new Date("2026-07-14T12:00:00.000Z"),
  },
  settings: {
    id: "f2c42286-d9ef-4e5c-8827-cb80e0f77a1a",
    language: "fr",
    autoSave: true,
    autoSaveInterval: 5,
    dailyWordCountGoal: 1000,
    spellcheck: true,
    goalReminder: true,
    backupReminder: true,
    theme: "light",
    fontSize: "medium",
    fontFamily: "system",
    compactMode: false,
    showLineNumbers: false,
    focusMode: false,
    shortcuts: [],
    enableNotifications: true,
    dailyReminder: true,
    enableAutoBackup: true,
    backupFrequency: "daily",
    exportFormat: "json",
    showStatistics: true,
    trackWritingTime: true,
    saveHistory: true,
  },
  structure: {
    id: "f4788a0e-6168-468a-a45f-8410c6743652",
    premise: null,
    genre: null,
    theme: null,
    structure: null,
    objectives: null,
  },
};

describe("goal dto schemas", () => {
  it("applies defaults for current progress and open state", () => {
    const result = createGoalSchema.parse({
      type: "daily",
      title: "Écrire 500 mots",
      goals: 500,
      unit: "words",
      deadline: null,
      description: null,
      project,
    });

    expect(result.current).toBe(0);
    expect(result.isOpen).toBe(true);
  });

  it("rejects goals lower than one", () => {
    const result = createGoalSchema.safeParse({
      type: "daily",
      title: "Écrire",
      goals: 0,
      unit: "words",
      deadline: null,
      description: null,
      project,
    });

    expect(result.success).toBe(false);
  });

  it("accepts partial updates", () => {
    expect(updateGoalSchema.parse({ current: 250 })).toEqual({ current: 250 });
  });
});
