import { createChapterSchema } from "../../../packages/source/src/dtos/chapter.dto";
import { createCharacterSchema, filterCharacterSchema } from "../../../packages/source/src/dtos/character.dto";
import { createEventSchema, filterEventSchema } from "../../../packages/source/src/dtos/event.dto";
import { exportParams } from "../../../packages/source/src/dtos/export.dto";
import { filterSchema } from "../../../packages/source/src/dtos/filter.dto";
import { createHistorySchema } from "../../../packages/source/src/dtos/history.dto";
import { createMindMapSchema, MindElixirDataSchema, NodeObjSchema, ThemeSchema } from "../../../packages/source/src/dtos/mindmap.dto";
import { createObjectSchema, filterObjectSchema } from "../../../packages/source/src/dtos/object.dto";
import { createPartSchema } from "../../../packages/source/src/dtos/part.dto";
import { createPlaceSchema } from "../../../packages/source/src/dtos/place.dto";
import { createRelationshipSchema } from "../../../packages/source/src/dtos/relationship.dto";

const zonedDate = "2026-07-14T12:00:00[Europe/Paris]";

const project = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Papyrus",
  description: null,
  genre: "Fantasy",
  author: "Lora",
  language: "fr",
  deadline: null,
  targetWordCount: 100_000,
  currentWordCount: 0,
  status: "planning",
  tags: ["draft"],
  user: {
    id: "22222222-2222-4222-8222-222222222222",
    firstName: "Lora",
    lastName: "Seguin",
    email: "lora@example.com",
    password: "secret123",
    createdAt: new Date("2026-07-14T00:00:00.000Z"),
  },
  settings: {
    id: "33333333-3333-4333-8333-333333333333",
    language: "fr",
    autoSave: true,
    autoSaveInterval: 5,
    dailyWordCountGoal: 1000,
    theme: "light",
    compactMode: false,
    fontSize: "medium",
    fontFamily: "system",
    showLineNumbers: false,
    focusMode: true,
    spellcheck: true,
    shortcuts: [],
    enableNotifications: true,
    dailyReminder: true,
    goalReminder: true,
    backupReminder: true,
    enableAutoBackup: true,
    backupFrequency: "daily",
    exportFormat: "json",
    showStatistics: true,
    trackWritingTime: true,
    saveHistory: true,
  },
  structure: {
    id: "44444444-4444-4444-8444-444444444444",
    premise: null,
    genre: null,
    theme: null,
    structure: null,
    objectives: null,
  },
} as const;

const character = {
  id: "55555555-5555-4555-8555-555555555555",
  role: "protagonist",
  roleStar: 5,
  firstName: "Ada",
  lastName: "Lovelace",
  nickName: "Ada",
  pronouns: "elle",
  gender: "female",
  nationality: null,
  age: 28,
  birthDate: null,
  birthPlace: null,
  residencePlace: null,
  occupation: null,
  height: null,
  weight: null,
  corpulence: null,
  hairColor: null,
  eyesColor: null,
  voice: null,
  outfit: null,
  accessory: null,
  description: null,
  characterQualities: null,
  characterFlaws: null,
  tastes: null,
  tics: null,
  fears: null,
  education: null,
  richesses: null,
  belief: null,
  secrets: null,
  notablePlaces: null,
  typicalExpression: null,
  goals: null,
  past: null,
  present: null,
  future: null,
  notes: null,
  color: "blue",
  project,
} as const;

describe("shared dto schemas", () => {
  it("parses query-style filters and export parameters", () => {
    expect(
      filterSchema.parse({
        page: "2",
        itemsPerPage: "25",
        disablePagination: "enabled",
        orderBy: '{"title":"asc","project":{"createdAt":"desc"}}',
      })
    ).toEqual({
      page: 2,
      itemsPerPage: 25,
      disablePagination: true,
      orderBy: { title: "asc", project: { createdAt: "desc" } },
    });

    expect(filterSchema.parse({ orderBy: "{bad json" }).orderBy).toEqual({});
    expect(exportParams.parse({ characters: "true", notes: "0", places: true })).toEqual({
      characters: true,
      notes: false,
      places: true,
    });
  });

  it("accepts chapters without a part and applies chapter defaults", () => {
    const parsed = createChapterSchema.parse({
      title: "Chapitre 1",
      content: null,
      resume: null,
      chapterNumber: 1,
      project,
    });

    expect(parsed.part).toBeUndefined();
    expect(parsed.status).toBe("toStart");
    expect(parsed.wordCount).toBe(0);
    expect(parsed.wordGoal).toBe(500);
  });

  it("validates project child entities", () => {
    expect(
      createPartSchema.parse({
        title: "Partie 1",
        project,
      }).status
    ).toBe("toStart");

    expect(
      createPlaceSchema.parse({
        name: "Ville",
        type: "city",
        localisation: "Nord",
        narrativeImportance: "high",
        color: "blue",
        project,
      }).population
    ).toBeUndefined();

    expect(
      createObjectSchema.parse({
        name: "Clef",
        importance: "medium",
        description: null,
        appearance: null,
        significance: null,
        location: null,
        type: null,
        history: null,
        color: null,
        project,
      }).name
    ).toBe("Clef");
  });

  it("validates events, history and filters using zoned dates", () => {
    expect(
      createEventSchema.parse({
        title: "Rencontre",
        description: null,
        importance: "critical",
        location: null,
        additionalDetails: null,
        eventDate: zonedDate,
        project,
      }).eventDate
    ).toBe(zonedDate);

    expect(
      createHistorySchema.parse({
        type: "create",
        entity: "event",
        date: zonedDate,
        title: "Création",
        project,
      }).entity
    ).toBe("event");

    expect(
      filterEventSchema.parse({
        importance: ["critical"],
        minDate: zonedDate,
        maxDate: zonedDate,
      }).importance
    ).toEqual(["critical"]);
  });

  it("validates characters, relationships and related filters", () => {
    expect(createCharacterSchema.parse(character).firstName).toBe("Ada");
    expect(
      filterCharacterSchema.parse({
        role: ["protagonist"],
        minAge: 18,
        maxAge: 80,
        objects: ["66666666-6666-4666-8666-666666666666"],
      }).role
    ).toEqual(["protagonist"]);
    expect(filterObjectSchema.parse({ importance: ["high"] }).importance).toEqual(["high"]);

    expect(
      createRelationshipSchema.parse({
        parentRelation: character,
        childRelation: { ...character, id: "77777777-7777-4777-8777-777777777777" },
        type: "mentor",
        project,
      }).type
    ).toBe("mentor");
  });

  it("validates mind map nodes, themes and maps", () => {
    const node = NodeObjSchema.parse({
      id: "root",
      topic: "Roman",
      expanded: true,
      direction: 1,
      children: [{ id: "child", topic: "Chapitre" }],
      style: { color: "#111" },
    });

    const theme = ThemeSchema.parse({
      name: "Papyrus",
      palette: ["#111"],
      cssVar: {
        "--node-gap-x": "20px",
        "--node-gap-y": "20px",
        "--main-gap-x": "40px",
        "--main-gap-y": "40px",
        "--main-color": "#111",
        "--main-bgcolor": "#fff",
        "--main-bgcolor-transparent": "transparent",
        "--color": "#111",
        "--bgcolor": "#fff",
        "--selected": "#2563eb",
        "--accent-color": "#2563eb",
        "--root-color": "#fff",
        "--root-bgcolor": "#111",
        "--root-border-color": "#111",
        "--root-radius": "8px",
        "--main-radius": "8px",
        "--topic-padding": "8px",
        "--panel-color": "#111",
        "--panel-bgcolor": "#fff",
        "--panel-border-color": "#ddd",
        "--map-padding": "16px",
      },
    });

    const data = MindElixirDataSchema.parse({ nodeData: node, direction: 1, theme });

    expect(createMindMapSchema.parse({ title: "Carte", data, project }).data.nodeData.topic).toBe(
      "Roman"
    );
  });
});
