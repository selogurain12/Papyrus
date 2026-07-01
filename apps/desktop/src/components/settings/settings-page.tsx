/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { isFetchError } from "@ts-rest/react-query/v5";
import {
  type AppPreferences,
  defaultPreferences,
  usePreferences,
} from "../../context/preference-provider";
import { queryKeys, SettingDto, UpdatedSettingDto } from "@papyrus/source";
import { toast } from "sonner";
import {
  Bell,
  Keyboard,
  Moon,
  Palette,
  Plus,
  RefreshCw,
  Save,
  SettingsIcon,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Tabs } from "../ui/tabs/tabs";
import { TabsList } from "../ui/tabs/tab-list";
import { TabsTrigger } from "../ui/tabs/tab-trigger";
import { TabsContent } from "../ui/tabs/tab-content";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { SingleSelector } from "../ui/single-select";
import { languageOptions, TypeOption } from "../../utils/value-for-select";
import { useTranslation } from "react-i18next";
import { client } from "../../utils/client/client";
import { queryClient } from "../../context/query-client";
import { useProject } from "../../context/project-provider";
import {
  defaultShortcuts,
  shortcutActions,
  ShortcutActionOption,
} from "../../utils/shortcut-actions";
import { acceleratorToDisplay, getAcceleratorFromKeyboardEvent } from "../../utils/shortcut-key";

type SettingsState = Omit<SettingDto, "id">;

const tabs = [
  { id: "general", labelKey: "tabs.general", icon: SettingsIcon },
  { id: "appearance", labelKey: "tabs.appearance", icon: Palette },
  { id: "editor", labelKey: "tabs.editor", icon: User },
  { id: "shortcuts", labelKey: "tabs.shortcuts", icon: Keyboard },
  { id: "notifications", labelKey: "tabs.notifications", icon: Bell },
];

const autoSaveIntervalOptions: TypeOption[] = [
  { id: "1", label: "options.autoSaveInterval.1" },
  { id: "5", label: "options.autoSaveInterval.5" },
  { id: "10", label: "options.autoSaveInterval.10" },
  { id: "15", label: "options.autoSaveInterval.15" },
  { id: "30", label: "options.autoSaveInterval.30" },
];

const fontSizeOptions: TypeOption[] = [
  { id: "small", label: "options.fontSize.small" },
  { id: "medium", label: "options.fontSize.medium" },
  { id: "large", label: "options.fontSize.large" },
  { id: "xlarge", label: "options.fontSize.xlarge" },
];

const fontFamilyOptions: TypeOption[] = [
  { id: "system", label: "options.fontFamily.system" },
  { id: "lora", label: "Lora" },
  { id: "merriweather", label: "Merriweather" },
  { id: "source-serif-4", label: "Source Serif 4" },
];

const globalPreferenceKeys = new Set<keyof SettingsState>([
  "language",
  "theme",
  "fontSize",
  "fontFamily",
]);

const defaultSettings: SettingsState = {
  language: defaultPreferences.language,
  autoSave: true,
  autoSaveInterval: 5,
  dailyWordCountGoal: 1000,
  theme: defaultPreferences.theme,
  compactMode: false,
  fontSize: defaultPreferences.fontSize,
  fontFamily: defaultPreferences.fontFamily,
  showLineNumbers: false,
  focusMode: true,
  spellcheck: true,
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
  };
}

function areSettingsEqual(firstSettings: SettingsState, secondSettings: SettingsState) {
  return JSON.stringify(firstSettings) === JSON.stringify(secondSettings);
}

function SettingSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsPage() {
  const { t } = useTranslation("settings/settings-page");
  const { currentProject, setCurrentProject } = useProject();
  const { updatePreferences } = usePreferences();
  const [activeView, setActiveView] = useState("general");
  const [shortcutAction, setShortcutAction] = useState<ShortcutActionOption | undefined>();
  const [shortcutValue, setShortcutValue] = useState("");
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

  function saveSettings() {
    if (!settingId) {
      toast.error(t("toasts.noProject"));
      return;
    }

    mutate({
      params: { id: settingId },
      body: settings satisfies UpdatedSettingDto,
    });
  }

  function handleAddShortcut() {
    const shortcut = shortcutValue.trim();

    if (!shortcutAction || !shortcut) {
      return;
    }

    updateSetting("shortcuts", [
      ...settings.shortcuts,
      {
        id: `${shortcutAction.id}:${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`,
        label: shortcutAction.label,
        shortcut,
      },
    ]);
    setShortcutAction(undefined);
    setShortcutValue("");
  }

  function handleDeleteShortcut(id: string) {
    updateSetting(
      "shortcuts",
      settings.shortcuts.filter((shortcut) => shortcut.id !== id)
    );
  }

  function handleShortcutKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Backspace" || event.key === "Delete" || event.key === "Escape") {
      setShortcutValue("");
      return;
    }

    const shortcut = getAcceleratorFromKeyboardEvent(event);
    if (shortcut) {
      setShortcutValue(shortcut);
    }
  }

  const translatedDefaultShortcuts = defaultShortcuts.map((shortcut) => ({
    ...shortcut,
    label: t(`shortcuts.defaults.${shortcut.id}`, { defaultValue: shortcut.label }),
  }));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-md text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
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
            onClick={saveSettings}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? t("actions.saving") : t("actions.save")}
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <div className="flex gap-6">
          <div className="w-1/3 rounded-xl border border-gray-200 bg-white p-3 dark:border-border dark:bg-card">
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

          <div className="w-2/3 rounded-xl border border-gray-200 bg-white p-6 dark:border-border dark:bg-card">
            <TabsContent value="general" className="mt-0 space-y-6">
              <SettingSection
                title={t("sections.general.title")}
                description={t("sections.general.description")}
              >
                <div className="space-y-2">
                  <Label>{t("fields.language")}</Label>
                  <SingleSelector<TypeOption>
                    customDisplay={(item: TypeOption) => t(`languages.${item.id}`)}
                    customLabel={(item: TypeOption) => (
                      <span className="font-medium">{t(`languages.${item.id}`)}</span>
                    )}
                    value={languageOptions.find((lang) => lang.id === settings.language)}
                    onChange={(value) => {
                      updateSetting("language", (value?.id ?? "fr") as SettingsState["language"]);
                    }}
                    placeholder={t("placeholders.language")}
                    data={languageOptions}
                  />
                </div>

                <SettingRow title={t("fields.autoSave")} description={t("descriptions.autoSave")}>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                  />
                </SettingRow>

                {settings.autoSave ? (
                  <div className="space-y-2">
                    <Label>{t("fields.autoSaveInterval")}</Label>
                    <SingleSelector<TypeOption>
                      customDisplay={(item: TypeOption) => t(item.label)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(item.label)}</span>
                      )}
                      value={autoSaveIntervalOptions.find(
                        (option) => option.id === String(settings.autoSaveInterval)
                      )}
                      onChange={(value) =>
                        updateSetting("autoSaveInterval", Number.parseInt(value?.id ?? "5", 10))
                      }
                      placeholder={t("placeholders.autoSaveInterval")}
                      data={autoSaveIntervalOptions}
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label>{t("fields.dailyWordGoal")}</Label>
                  <Input
                    min={100}
                    max={10000}
                    step={100}
                    type="number"
                    value={settings.dailyWordCountGoal}
                    onChange={(event) =>
                      updateSetting(
                        "dailyWordCountGoal",
                        Number.parseInt(event.currentTarget.value, 10)
                      )
                    }
                  />
                </div>
              </SettingSection>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-6">
              <SettingSection
                title={t("sections.appearance.title")}
                description={t("sections.appearance.description")}
              >
                <div className="space-y-2">
                  <Label>{t("fields.theme")}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateSetting("theme", "light")}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                        settings.theme === "light"
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200"
                          : "border-gray-300 hover:bg-gray-50 dark:border-border dark:text-foreground dark:hover:bg-muted"
                      }`}
                    >
                      <Sun className="h-4 w-4" />
                      {t("theme.light")}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("theme", "dark")}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                        settings.theme === "dark"
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200"
                          : "border-gray-300 hover:bg-gray-50 dark:border-border dark:text-foreground dark:hover:bg-muted"
                      }`}
                    >
                      <Moon className="h-4 w-4" />
                      {t("theme.dark")}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("fields.fontSize")}</Label>
                    <SingleSelector<TypeOption>
                      customDisplay={(item: TypeOption) => t(item.label)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(item.label)}</span>
                      )}
                      value={fontSizeOptions.find((option) => option.id === settings.fontSize)}
                      onChange={(value) => {
                        updateSetting(
                          "fontSize",
                          (value?.id ?? "medium") as SettingsState["fontSize"]
                        );
                      }}
                      placeholder={t("placeholders.fontSize")}
                      data={fontSizeOptions}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("fields.fontFamily")}</Label>
                    <SingleSelector<TypeOption>
                      customDisplay={(item: TypeOption) => t(item.label)}
                      customLabel={(item: TypeOption) => (
                        <span className="font-medium">{t(item.label)}</span>
                      )}
                      value={fontFamilyOptions.find((option) => option.id === settings.fontFamily)}
                      onChange={(value) => {
                        updateSetting(
                          "fontFamily",
                          (value?.id ?? "system") as SettingsState["fontFamily"]
                        );
                      }}
                      placeholder={t("placeholders.fontFamily")}
                      data={fontFamilyOptions}
                    />
                  </div>
                </div>

                <SettingRow
                  title={t("fields.compactMode")}
                  description={t("descriptions.compactMode")}
                >
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSetting("compactMode", checked)}
                  />
                </SettingRow>
              </SettingSection>
            </TabsContent>

            <TabsContent value="editor" className="mt-0 space-y-6">
              <SettingSection
                title={t("sections.editor.title")}
                description={t("sections.editor.description")}
              >
                <SettingRow
                  title={t("fields.spellcheck")}
                  description={t("descriptions.spellcheck")}
                >
                  <Switch
                    checked={settings.spellcheck}
                    onCheckedChange={(checked) => updateSetting("spellcheck", checked)}
                  />
                </SettingRow>

                <SettingRow title={t("fields.focusMode")} description={t("descriptions.focusMode")}>
                  <Switch
                    checked={settings.focusMode}
                    onCheckedChange={(checked) => updateSetting("focusMode", checked)}
                  />
                </SettingRow>

                <SettingRow
                  title={t("fields.showLineNumbers")}
                  description={t("descriptions.showLineNumbers")}
                >
                  <Switch
                    checked={settings.showLineNumbers}
                    onCheckedChange={(checked) => updateSetting("showLineNumbers", checked)}
                  />
                </SettingRow>

                <Separator />

                <div className="space-y-2">
                  <Label>{t("fields.sessionWordGoal")}</Label>
                  <Input
                    min={100}
                    max={10000}
                    step={100}
                    type="number"
                    value={settings.dailyWordCountGoal}
                    onChange={(event) =>
                      updateSetting(
                        "dailyWordCountGoal",
                        Number.parseInt(event.currentTarget.value, 10)
                      )
                    }
                  />
                </div>
              </SettingSection>
            </TabsContent>

            <TabsContent value="shortcuts" className="mt-0 space-y-6">
              <SettingSection
                title={t("sections.shortcuts.title")}
                description={t("sections.shortcuts.description")}
              >
                {settings.shortcuts.map((shortcut) => (
                  <SettingRow
                    key={shortcut.id}
                    title={t(`shortcuts.defaults.${shortcut.id}`, { defaultValue: shortcut.label })}
                  >
                    <div className="flex items-center gap-2">
                      <kbd className="rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:border-border dark:bg-muted dark:text-muted-foreground">
                        {acceleratorToDisplay(shortcut.shortcut)}
                      </kbd>
                      <Button
                        variant="ghost"
                        size="square"
                        onClick={() => handleDeleteShortcut(shortcut.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </SettingRow>
                ))}

                <Separator />

                <div className="grid grid-cols-[1fr_180px_auto] items-end gap-3">
                  <div className="space-y-2">
                    <Label>{t("fields.shortcutAction")}</Label>
                    <SingleSelector<ShortcutActionOption>
                      customDisplay={(item) =>
                        t(`shortcutActions.${item.id}`, { defaultValue: item.label })
                      }
                      customLabel={(item) => (
                        <span className="font-medium">
                          {t(`shortcutActions.${item.id}`, { defaultValue: item.label })}
                        </span>
                      )}
                      value={shortcutAction}
                      onChange={setShortcutAction}
                      placeholder={t("placeholders.shortcutAction")}
                      data={shortcutActions}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("fields.shortcut")}</Label>
                    <Input
                      readOnly
                      value={acceleratorToDisplay(shortcutValue)}
                      onKeyDown={handleShortcutKeyDown}
                      placeholder={t("placeholders.shortcut")}
                    />
                  </div>
                  <Button
                    variant="outline"
                    disabled={!shortcutAction || !shortcutValue.trim()}
                    onClick={handleAddShortcut}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("actions.add")}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => updateSetting("shortcuts", translatedDefaultShortcuts)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("actions.restoreShortcuts")}
                </Button>
              </SettingSection>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6">
              <SettingSection
                title={t("sections.notifications.title")}
                description={t("sections.notifications.description")}
              >
                <SettingRow
                  title={t("fields.enableNotifications")}
                  description={t("descriptions.enableNotifications")}
                >
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
                  />
                </SettingRow>

                <SettingRow
                  title={t("fields.dailyReminder")}
                  description={t("descriptions.dailyReminder")}
                >
                  <Switch
                    checked={settings.dailyReminder}
                    onCheckedChange={(checked) => updateSetting("dailyReminder", checked)}
                  />
                </SettingRow>

                <SettingRow
                  title={t("fields.goalReminder")}
                  description={t("descriptions.goalReminder")}
                >
                  <Switch
                    checked={settings.goalReminder}
                    onCheckedChange={(checked) => updateSetting("goalReminder", checked)}
                  />
                </SettingRow>

                <SettingRow
                  title={t("fields.backupReminder")}
                  description={t("descriptions.backupReminder")}
                >
                  <Switch
                    checked={settings.backupReminder}
                    onCheckedChange={(checked) => updateSetting("backupReminder", checked)}
                  />
                </SettingRow>
              </SettingSection>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
