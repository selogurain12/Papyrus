import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LanguageType } from "@papyrus/source";
import i18n from "../i18n";
import { useProject } from "./project-provider";

export type AppPreferences = {
  language: LanguageType;
  theme: "light" | "dark";
  fontSize: "small" | "medium" | "large" | "xlarge";
  fontFamily: "system" | "lora" | "merriweather" | "source-serif-4";
};

interface PreferencesContextValue {
  preferences: AppPreferences;
  // eslint-disable-next-line no-unused-vars
  updatePreferences: (values: Partial<AppPreferences>) => void;
}

export const defaultPreferences: AppPreferences = {
  language: "fr",
  theme: "light",
  fontSize: "medium",
  fontFamily: "system",
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const fontFamilies: Record<AppPreferences["fontFamily"], string> = {
  system: "Inter, ui-sans-serif, system-ui, sans-serif",
  lora: "Lora, Georgia, serif",
  merriweather: "Merriweather, Georgia, serif",
  // eslint-disable-next-line quotes
  "source-serif-4": '"Source Serif 4", Georgia, serif',
};

const fontSizes: Record<AppPreferences["fontSize"], string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
  xlarge: "20px",
};

function readStoredPreferences() {
  try {
    const rawPreferences = localStorage.getItem("preferences");
    const legacyTheme = localStorage.getItem("theme");

    if (!rawPreferences) {
      return {
        ...defaultPreferences,
        theme: legacyTheme === "dark" ? "dark" : defaultPreferences.theme,
      };
    }

    return {
      ...defaultPreferences,
      ...(JSON.parse(rawPreferences) as Partial<AppPreferences>),
    };
  } catch {
    return defaultPreferences;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { currentProject } = useProject();
  const [preferences, setPreferences] = useState<AppPreferences>(readStoredPreferences);

  const updatePreferences = useCallback((values: Partial<AppPreferences>) => {
    setPreferences((previousPreferences) => ({
      ...previousPreferences,
      ...values,
    }));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", preferences.theme === "dark");
    document.documentElement.style.setProperty(
      "--app-font-family",
      fontFamilies[preferences.fontFamily]
    );
    document.documentElement.style.setProperty("--app-font-size", fontSizes[preferences.fontSize]);
    localStorage.setItem("preferences", JSON.stringify(preferences));
    localStorage.setItem("theme", preferences.theme);
    void i18n.changeLanguage(preferences.language);
  }, [preferences]);

  useEffect(() => {
    if (!currentProject) {
      return;
    }

    updatePreferences({
      language: currentProject.settings.language,
      theme: currentProject.settings.theme,
      fontSize: currentProject.settings.fontSize,
      fontFamily: currentProject.settings.fontFamily,
    });
  }, [currentProject, updatePreferences]);

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
    }),
    [preferences, updatePreferences]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used inside PreferencesProvider");
  }

  return context;
}
