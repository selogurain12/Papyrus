/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { useTranslation } from "react-i18next";
import { TabsContent } from "../../ui/tabs/tab-content";
import { SettingSection } from "../settings-components/settings-section";
import { Label } from "../../ui/label";
import { Moon, Sun } from "lucide-react";
import { SingleSelector } from "../../ui/single-select";
import { fontFamilyOptions, fontSizeOptions, TypeOption } from "../../../utils/value-for-select";
import { SettingRow } from "../settings-components/settings-row";
import { Switch } from "../../ui/switch";
import { FontFamilyType, FontSizeType, SettingDto } from "@papyrus/source";

interface SettingsTabsAppearanceProps {
  setting: Omit<SettingDto, "id">;

  updateSetting: <Key extends keyof Omit<SettingDto, "id">>(
    key: Key,
    value: Omit<SettingDto, "id">[Key]
  ) => void;
}

export function SettingsTabsAppearance({ setting, updateSetting }: SettingsTabsAppearanceProps) {
  const { t } = useTranslation("settings/settings-page");
  return (
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
              onClick={() => {
                updateSetting("theme", "light");
              }}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                setting.theme === "light"
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200"
                  : "border-gray-300 hover:bg-gray-50 dark:border-border dark:text-foreground dark:hover:bg-muted"
              }`}
            >
              <Sun className="h-4 w-4" />
              {t("theme.light")}
            </button>
            <button
              type="button"
              onClick={() => {
                updateSetting("theme", "dark");
              }}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                setting.theme === "dark"
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
              value={fontSizeOptions.find((option) => option.id === setting.fontSize)}
              onChange={(value) => {
                updateSetting("fontSize", (value?.id ?? "medium") as FontSizeType);
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
              value={fontFamilyOptions.find((option) => option.id === setting.fontFamily)}
              onChange={(value) => {
                updateSetting("fontFamily", (value?.id ?? "system") as FontFamilyType);
              }}
              placeholder={t("placeholders.fontFamily")}
              data={fontFamilyOptions}
            />
          </div>
        </div>

        <SettingRow title={t("fields.compactMode")} description={t("descriptions.compactMode")}>
          <Switch
            checked={setting.compactMode}
            onCheckedChange={(checked) => {
              updateSetting("compactMode", checked);
            }}
          />
        </SettingRow>
      </SettingSection>
    </TabsContent>
  );
}
