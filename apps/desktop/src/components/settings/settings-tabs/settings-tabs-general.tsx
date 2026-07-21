/* eslint-disable no-unused-vars */
import { useTranslation } from "react-i18next";
import { TabsContent } from "../../ui/tabs/tab-content";
import { SettingSection } from "../settings-components/settings-section";
import { Label } from "../../ui/label";
import { SingleSelector } from "../../ui/single-select";
import {
  autoSaveIntervalOptions,
  languageOptions,
  TypeOption,
} from "../../../utils/value-for-select";
import { SettingRow } from "../settings-components/settings-row";
import { Switch } from "../../ui/switch";
import { Input } from "../../ui/input";
import { LanguageType, SettingDto } from "@papyrus/source";

interface SettingsTabsGeneralProps {
  setting: Omit<SettingDto, "id">;

  updateSetting: <Key extends keyof Omit<SettingDto, "id">>(
    key: Key,
    value: Omit<SettingDto, "id">[Key]
  ) => void;
}

export function SettingsTabsGeneral({ setting, updateSetting }: SettingsTabsGeneralProps) {
  const { t } = useTranslation("settings/settings-page");
  return (
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
            value={languageOptions.find((lang) => lang.id === setting.language)}
            onChange={(value) => {
              updateSetting("language", (value?.id ?? "fr") as LanguageType);
            }}
            placeholder={t("placeholders.language")}
            data={languageOptions}
          />
        </div>

        <SettingRow title={t("fields.autoSave")} description={t("descriptions.autoSave")}>
          <Switch
            checked={setting.autoSave}
            onCheckedChange={(checked) => {
              updateSetting("autoSave", checked);
            }}
          />
        </SettingRow>

        {setting.autoSave ? (
          <div className="space-y-2">
            <Label>{t("fields.autoSaveInterval")}</Label>
            <SingleSelector<TypeOption>
              customDisplay={(item: TypeOption) => t(item.label)}
              customLabel={(item: TypeOption) => (
                <span className="font-medium">{t(item.label)}</span>
              )}
              value={autoSaveIntervalOptions.find(
                (option) => option.id === String(setting.autoSaveInterval)
              )}
              onChange={(value) => {
                updateSetting("autoSaveInterval", Number.parseInt(value?.id ?? "5", 10));
              }}
              placeholder={t("placeholders.autoSaveInterval")}
              data={autoSaveIntervalOptions}
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label>{t("fields.dailyWordGoal")}</Label>
          <Input
            id="settings-daily-word-goal"
            min={100}
            max={10000}
            step={100}
            type="number"
            value={setting.dailyWordCountGoal}
            placeholder={t("placeholders.dailyWordGoal")}
            onChange={(event) => {
              updateSetting("dailyWordCountGoal", Number.parseInt(event.currentTarget.value, 10));
            }}
          />
        </div>
      </SettingSection>
    </TabsContent>
  );
}
