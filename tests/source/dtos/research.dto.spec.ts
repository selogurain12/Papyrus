import { createResearchSchema } from "../../../packages/source/src/dtos/research.dto";

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

describe("research dto schemas", () => {
  it("accepts a research item without URL", () => {
    const result = createResearchSchema.parse({
      title: "Article utile",
      type: "articles",
      tag: [],
      description: "Résumé de la ressource",
      link: null,
      project,
    });

    expect(result.link).toBeNull();
  });

  it("accepts a file URL or external URL as optional link", () => {
    expect(
      createResearchSchema.safeParse({
        title: "Vidéo",
        type: "videos",
        tag: [],
        description: "Ressource vidéo",
        link: "https://youtube.com/watch?v=abc",
        project,
      }).success
    ).toBe(true);
  });
});
