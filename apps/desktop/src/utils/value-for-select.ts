export const genre = [
  { id: "roman", label: "Roman" },
  { id: "thriller", label: "Thriller" },
  { id: "fantasy", label: "Fantastique" },
  { id: "science-fiction", label: "Science-Fiction" },
  { id: "romance", label: "Romance" },
  { id: "police", label: "Policier" },
  { id: "mystery", label: "Mistère" },
  { id: "horror", label: "Horreur" },
  { id: "historical", label: "Historique" },
  { id: "non-fiction", label: "Non-Fiction" },
  { id: "young-adult", label: "Jeunesse" },
  { id: "children", label: "Enfants" },
  { id: "biography", label: "Biographie" },
  { id: "self-help", label: "Développement Personnel" },
  { id: "health", label: "Santé" },
  { id: "travel", label: "Voyage" },
  { id: "guide", label: "Guide" },
  { id: "religion", label: "Religion" },
  { id: "science", label: "Science" },
  { id: "history", label: "Histoire" },
  { id: "poetry", label: "Poésie" },
  { id: "essay", label: "Essai" },
  { id: "theater", label: "Théâtre" },
  { id: "other", label: "Autre" },
];

export const statusOptions = [
  { id: "planning", label: "Planification" },
  { id: "writing", label: "Écriture" },
  { id: "editing", label: "Édition" },
  { id: "completed", label: "Terminé" },
];

export const languageOptions = [
  { id: "fr", label: "Français" },
  { id: "en", label: "Anglais" },
  { id: "es", label: "Espagnol" },
  { id: "de", label: "Allemand" },
  { id: "it", label: "Italien" },
  { id: "pt", label: "Portugais" },
  { id: "ru", label: "Russe" },
  { id: "zh", label: "Chinois" },
  { id: "ja", label: "Japonais" },
  { id: "ko", label: "Coréen" },
  { id: "cs", label: "Tchèque" },
];

export const roleOptions = [
  { id: "protagonist", label: "Protagoniste" },
  { id: "antagonist", label: "Antagoniste" },
  { id: "ally", label: "Allié" },
  { id: "mentor", label: "Mentor" },
  { id: "secondary character", label: "Personnage secondaire" },
];

export const importanceOptions = [
  { id: "high", label: "Elevée" },
  { id: "medium", label: "Moyenne" },
  { id: "low", label: "Faible" },
];

export const typeOptions = [
  { id: "city", label: "Ville" },
  { id: "village", label: "Village" },
  { id: "country", label: "Pays" },
  { id: "continent", label: "Continent" },
  { id: "planet", label: "Planète" },
  { id: "space station", label: "Station spatiale" },
  { id: "other", label: "Autre" },
];

export const objectTypeOptions = [
  { id: "weapon", label: "Arme" },
  { id: "artifact", label: "Artefact" },
  { id: "jewelry", label: "Bijou" },
  { id: "paper", label: "Documents" },
  { id: "equipment", label: "Equipement" },
  { id: "furniture", label: "Meuble" },
  { id: "tool", label: "Outil" },
  { id: "technology", label: "Technologie" },
  { id: "vehicle", label: "Véhicule" },
  { id: "clothing", label: "Vêtement" },
];

export const statusPartOptions = [
  { id: "toStart", label: "À commencer" },
  { id: "inProgress", label: "En cours" },
  { id: "completed", label: "Terminé" },
];

export const unitOptions = [
  { id: "words", label: "Mots" },
  { id: "chapters", label: "Chapitres" },
];

export const autoSaveIntervalOptions = [
  { id: "1", label: "options.autoSaveInterval.1" },
  { id: "2", label: "options.autoSaveInterval.2" },
  { id: "5", label: "options.autoSaveInterval.5" },
  { id: "10", label: "options.autoSaveInterval.10" },
  { id: "15", label: "options.autoSaveInterval.15" },
  { id: "30", label: "options.autoSaveInterval.30" },
];

export const fontSizeOptions = [
  { id: "small", label: "options.fontSize.small" },
  { id: "medium", label: "options.fontSize.medium" },
  { id: "large", label: "options.fontSize.large" },
  { id: "xlarge", label: "options.fontSize.xlarge" },
];

export const fontFamilyOptions = [
  { id: "system", label: "options.fontFamily.system" },
  { id: "lora", label: "Lora" },
  { id: "merriweather", label: "Merriweather" },
  { id: "source-serif-4", label: "Source Serif 4" },
];

export type TypeOption = {
  id: string;
  label: string;
};
