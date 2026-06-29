import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const localeModules = import.meta.glob("./locales/**/*.json", {
  eager: true,
  import: "default",
});

const resources = Object.entries(localeModules).reduce<
  Record<string, Record<string, Record<string, unknown>>>
>((accumulator, [path, translations]) => {
  const match = path.match(/^\.\/locales\/([^/]+)\/(.+)\.json$/);

  if (!match) {
    return accumulator;
  }

  const [, language, namespacePath] = match;
  const namespace = namespacePath.replace(/\/index$/, "");

  accumulator[language] ??= {};
  accumulator[language][namespace] = translations as Record<string, unknown>;

  return accumulator;
}, {});

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
