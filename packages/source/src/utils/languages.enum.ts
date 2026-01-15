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

export type LanguageType = (typeof languagesTypes)[number];
