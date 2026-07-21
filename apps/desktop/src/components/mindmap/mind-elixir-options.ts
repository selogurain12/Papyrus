import { de, en, es, fr, it, ja, ko, pt, ru, zh_CN as zhCN, type LangPack } from "mind-elixir/i18n";

const mindElixirLocales: Record<string, LangPack> = {
  de,
  en,
  es,
  fr,
  it,
  ja,
  ko,
  pt,
  ru,
  zh: zhCN,
};

export function getEditableMindMapOptions(language: string, newTopicName: string) {
  const normalizedLanguage = language.split("-")[0] ?? "en";
  const locale = mindElixirLocales[normalizedLanguage] ?? en;

  return {
    contextMenu: {
      locale,
      focus: true,
      link: true,
    },
    newTopicName,
  };
}
