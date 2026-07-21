/* eslint-disable max-lines */
/* eslint-disable complexity */

/* eslint-disable max-len */
import { isFetchError } from "@ts-rest/react-query/v5";
import { queryKeys, SettingDto, UpdatedSettingDto } from "@papyrus/source";
import { toast } from "sonner";
import { Bell, Keyboard, Palette, RefreshCw, Save, SettingsIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type AppPreferences,
  defaultPreferences,
  usePreferences,
} from "../../context/preference-provider";
import { Tabs } from "../ui/tabs/tabs";
import { TabsList } from "../ui/tabs/tab-list";
import { TabsTrigger } from "../ui/tabs/tab-trigger";
import { Button } from "../ui/button";
import { client } from "../../utils/client/client";
import { queryClient } from "../../context/query-client";
import { useProject } from "../../context/project-provider";
import { defaultShortcuts } from "../../utils/shortcut-actions";
import { SettingsTabsGeneral } from "./settings-tabs/settings-tabs-general";
import { SettingsTabsAppearance } from "./settings-tabs/settings-tabs-appearance";
import { SettingsTabsShortcuts } from "./settings-tabs/settings-tabs-shortcuts";
import { SettingsTabsNotifications } from "./settings-tabs/settings-tabs-notifications";
import { useOnlineStatus } from "../../hooks/use-online-status";
import { updateOfflineEntity } from "../../local-db/offline-entity-store";
import { getLocalDatabaseApi } from "../../local-db/renderer";
import type { JsonValue } from "../../local-db/types";

type SettingsState = Omit<SettingDto, "id">;
const settingsEntityType = "settings";

const tabs = [
  { id: "general", labelKey: "tabs.general", icon: SettingsIcon },
  { id: "appearance", labelKey: "tabs.appearance", icon: Palette },
  { id: "shortcuts", labelKey: "tabs.shortcuts", icon: Keyboard },
  { id: "notifications", labelKey: "tabs.notifications", icon: Bell },
];

const globalPreferenceKeys = new Set<keyof SettingsState>([
  "language",
  "theme",
  "fontSize",
  "fontFamily",
  "compactMode",
]);

const defaultSettings: SettingsState = {
  language: defaultPreferences.language,
  autoSave: true,
  autoSaveInterval: 5,
  dailyWordCountGoal: 1000,
  theme: defaultPreferences.theme,
  compactMode: false,
  showLineNumbers: false,
  focusMode: true,
  spellcheck: true,
  fontSize: defaultPreferences.fontSize,
  fontFamily: defaultPreferences.fontFamily,
  shortcuts: defaultShortcuts,
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
};

function toSettingsState(settings: SettingDto | null | undefined): SettingsState {
  if (!settings) {
    return defaultSettings;
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { id, ...settingsState } = settings;
  return { ...defaultSettings, ...settingsState };
}

function toPreferences(settings: SettingsState): AppPreferences {
  return {
    language: settings.language,
    theme: settings.theme,
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
    compactMode: settings.compactMode,
  };
}

function areSettingsEqual(firstSettings: SettingsState, secondSettings: SettingsState) {
  return JSON.stringify(firstSettings) === JSON.stringify(secondSettings);
}

function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue;
}

function fromJsonValue(value: JsonValue): SettingDto {
  return value as unknown as SettingDto;
}

export function SettingsPage() {
  const { t } = useTranslation("settings/settings-page");
  const { currentProject, setCurrentProject } = useProject();
  const { updatePreferences } = usePreferences();
  const isOnline = useOnlineStatus();
  const [activeView, setActiveView] = useState("general");
  const settingId = currentProject?.settings.id;
  const [settings, setSettings] = useState<SettingsState>(() =>
    toSettingsState(currentProject?.settings)
  );
  const [initialSettings, setInitialSettings] = useState<SettingsState>(() =>
    toSettingsState(currentProject?.settings)
  );

  const query = client.setting.get.useQuery({
    queryKey: queryKeys.setting.get({ pathParams: { id: settingId ?? "" } }),
    queryData: {
      params: { id: settingId ?? "" },
    },
    enabled: Boolean(settingId),
  });

  const { mutate, isPending: isSaving } = client.setting.update.useMutation({
    onSuccess: (response) => {
      const nextSettings = toSettingsState(response.body);

      setSettings(nextSettings);
      setInitialSettings(nextSettings);
      updatePreferences(toPreferences(nextSettings));

      if (currentProject) {
        setCurrentProject({ ...currentProject, settings: response.body });
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.setting.get({ pathParams: { id: response.body.id } }),
      });
      toast.success(t("toasts.success"));
    },
    onError: (error) => {
      toast.error(isFetchError(error) ? error.message : t("toasts.error"));
    },
  });

  useEffect(() => {
    const nextSettings = toSettingsState(query.data?.body ?? currentProject?.settings);

    setSettings(nextSettings);
    setInitialSettings(nextSettings);
    updatePreferences(toPreferences(nextSettings));
  }, [currentProject?.settings, query.data?.body, updatePreferences]);

  useEffect(() => {
    if (!settingId) {
      return;
    }

    void getLocalDatabaseApi()
      .getEntity(settingsEntityType, settingId)
      .then((entity) => {
        if (!entity) {
          return;
        }

        const nextSettings = toSettingsState(fromJsonValue(entity.payload));
        setSettings(nextSettings);
        setInitialSettings(nextSettings);
        updatePreferences(toPreferences(nextSettings));
      })
      .catch((error) => {
        console.error("Unable to read cached settings", error);
      });
  }, [settingId, updatePreferences]);

  useEffect(() => {
    if (!currentProject?.id || !query.data?.body) {
      return;
    }

    void getLocalDatabaseApi()
      .saveEntity({
        entityType: settingsEntityType,
        id: query.data.body.id,
        serverId: query.data.body.id,
        projectId: currentProject.id,
        payload: toJsonValue(query.data.body),
        syncStatus: "synced",
      })
      .catch((error) => {
        console.error("Unable to cache settings", error);
      });
  }, [currentProject?.id, query.data?.body]);

  const isDirty = useMemo(
    () => !areSettingsEqual(settings, initialSettings),
    [initialSettings, settings]
  );

  const isLoading = query.isLoading;
  const canSave = Boolean(settingId);

  function updateSetting<Key extends keyof SettingsState>(key: Key, value: SettingsState[Key]) {
    setSettings((currentSettings) => ({ ...currentSettings, [key]: value }));

    if (globalPreferenceKeys.has(key)) {
      updatePreferences({ [key]: value } as Partial<AppPreferences>);
    }
  }

  function resetSettings() {
    setSettings(initialSettings);
    updatePreferences(toPreferences(initialSettings));
  }

  async function saveSettings() {
    if (!settingId) {
      toast.error(t("toasts.noProject"));
      return;
    }

    if (!isOnline && currentProject) {
      const nextSettings = {
        ...currentProject.settings,
        ...settings,
      };

      await updateOfflineEntity<UpdatedSettingDto, SettingDto>(
        settingsEntityType,
        currentProject.id,
        currentProject.settings,
        settings satisfies UpdatedSettingDto
      );

      const nextSettingsState = toSettingsState(nextSettings);
      setSettings(nextSettingsState);
      setInitialSettings(nextSettingsState);
      updatePreferences(toPreferences(nextSettingsState));
      setCurrentProject({ ...currentProject, settings: nextSettings });
      toast.success(t("toasts.success"));
      return;
    }

    mutate({
      params: { id: settingId },
      body: settings satisfies UpdatedSettingDto,
    });
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between" data-tour="page-header">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-md text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2" data-tour="settings-actions">
          <Button
            variant="outline"
            disabled={isLoading || isSaving || !isDirty}
            onClick={resetSettings}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("actions.reset")}
          </Button>
          <Button
            variant="blue"
            disabled={isLoading || isSaving || !isDirty || !canSave}
            isLoading={isSaving}
            onClick={saveSettings}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? t("actions.saving") : t("actions.save")}
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <div className="flex gap-6">
          <div
            className="w-1/3 rounded-xl border border-gray-200 bg-white p-3 dark:border-border dark:bg-card"
            data-tour="settings-tabs"
          >
            <TabsList className="w-full flex-col items-stretch justify-start bg-transparent p-0">
              {tabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className={`w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-left shadow-none transition-all duration-200 data-[state=active]:shadow-none ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 dark:bg-blue-950 dark:text-blue-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-primary-600" : "text-secondary-400"}`}
                    />
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div
            className="w-2/3 rounded-xl border border-gray-200 bg-white p-6 dark:border-border dark:bg-card"
            data-tour="settings-panel"
          >
            <SettingsTabsGeneral setting={settings} updateSetting={updateSetting} />

            <SettingsTabsAppearance setting={settings} updateSetting={updateSetting} />

            <SettingsTabsShortcuts setting={settings} updateSetting={updateSetting} />

            <SettingsTabsNotifications setting={settings} updateSetting={updateSetting} />
          </div>
        </div>
      </Tabs>
    </div>
  );
}
