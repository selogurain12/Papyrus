/* istanbul ignore file */

const now = "2026-07-14T12:00:00[Europe/Paris]";

export const projectFixture = {
  id: "project-1",
  title: "Projet test",
  description: "Un roman de test",
  genre: "fantasy",
  author: "Lora",
  language: "fr",
  status: "writing",
  deadline: null,
  currentWordCount: 4500,
  targetWordCount: 10000,
  createdAt: now,
  updatedAt: now,
  tags: ["roman"],
  structure: {
    id: "structure-1",
    premise: "Une idée forte",
    genre: "Fantasy",
    theme: "Courage",
    structure: "Trois actes",
    objectives: ["finir le chapitre"],
  },
  settings: {
    id: "settings-1",
    language: "fr",
    autoSave: true,
    autoSaveInterval: 5,
    dailyWordCountGoal: 1000,
    theme: "light",
    compactMode: false,
    showLineNumbers: false,
    focusMode: true,
    spellcheck: true,
    fontSize: 16,
    fontFamily: "Inter",
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
} as any;

export const partFixture = {
  id: "part-1",
  title: "Partie I",
  description: "La première partie",
  project: projectFixture,
} as any;

export const chapterFixture = {
  id: "chapter-1",
  title: "Chapitre visible",
  status: "inProgress",
  content: JSON.stringify({
    root: {
      children: [
        {
          children: [{ text: "Le contenu est lisible.", type: "text" }],
          type: "paragraph",
        },
      ],
      type: "root",
    },
  }),
  resume: "Résumé du chapitre",
  chapterNumber: 1,
  wordCount: 4,
  wordGoal: 1200,
  project: projectFixture,
  part: partFixture,
} as any;

export const chapterWithoutPartFixture = {
  ...chapterFixture,
  id: "chapter-without-part",
  title: "Chapitre sans partie",
  part: undefined,
} as any;

export const characterFixture = {
  id: "character-1",
  firstName: "Ada",
  lastName: "Lovelace",
  nickName: "Enchantress",
  role: "protagonist",
  roleStar: 4,
  color: "blue",
  age: 28,
  birthPlace: "Londres",
  birthDate: "1998-12-10T00:00:00[Europe/Paris]",
  gender: "female",
  nationality: "Anglaise",
  residencePlace: "Paris",
  occupation: "Inventrice",
  characterQualities: ["curieuse"],
  characterFlaws: ["impatiente"],
  project: projectFixture,
} as any;

export const placeFixture = {
  id: "place-1",
  name: "Citadelle Bleue",
  type: "city",
  narrativeImportance: "high",
  color: "purple",
  language: "fr",
  government: "Conseil",
  population: "1200 habitants",
  ressources: "Cristaux",
  physicalDescription: "Tours de verre",
  atmosphere: "Mystérieuse",
  usages: "Marchés nocturnes",
  history: "Ancienne capitale",
  project: projectFixture,
} as any;

export const objectFixture = {
  id: "object-1",
  name: "Boussole lunaire",
  type: "artifact",
  importance: "medium",
  color: "green",
  description: "Indique les souvenirs",
  appearance: "Argentée",
  significance: "Clé de l'intrigue",
  location: "Citadelle Bleue",
  history: "Forgée avant la guerre",
  project: projectFixture,
} as any;

export const eventFixture = {
  id: "event-1",
  title: "Rencontre décisive",
  description: "Les héros se rencontrent.",
  location: "Citadelle Bleue",
  additionalDetails: "Sous la pluie",
  eventDate: "2026-07-14T18:30:00[Europe/Paris]",
  importance: "important",
  project: projectFixture,
} as any;

export const noteFixture = {
  id: "note-1",
  title: "Note de monde",
  content: "Une règle importante.",
  color: "yellow",
  tags: ["monde"],
  linkFile: "file:///tmp/document.pdf",
  project: projectFixture,
} as any;

export const researchFixture = {
  id: "research-1",
  title: "Article utile",
  description: "Une source importante.",
  sources: "Archive",
  type: "articles",
  link: "https://example.com/article",
  tag: ["histoire"],
  note: "À relire",
  project: projectFixture,
} as any;

export const mindmapFixture = {
  id: "mindmap-1",
  title: "Carte personnages",
  nodes: [],
  edges: [],
  project: projectFixture,
} as any;

export const dashboardFixture = {
  summaryCards: [
    { label: "Mots écrits", value: 4500, change: "+500 aujourd'hui", icon: "bookOpen", color: "blue" },
    { label: "Personnages", value: 3, change: "+1 récemment", icon: "users", color: "purple" },
  ],
  progress: [{ label: "Mots aujourd'hui", value: 500, target: 1000, color: "green" }],
  writingStreak: {
    days: 3,
    progress: 50,
    currentWordCount: 500,
    targetWordCount: 1000,
  },
} as any;
