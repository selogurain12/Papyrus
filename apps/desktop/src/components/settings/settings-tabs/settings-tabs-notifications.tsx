/* eslint-disable no-unused-vars */
import { useTranslation } from "react-i18next";
import { Switch } from "../../ui/switch";
import { TabsContent } from "../../ui/tabs/tab-content";
import { SettingRow } from "../settings-components/settings-row";
import { SettingSection } from "../settings-components/settings-section";
import { SettingDto } from "@papyrus/source";
import { toast } from "sonner";

interface SettingsTabsNotificationsProps {
  setting: Omit<SettingDto, "id">;

  updateSetting: <Key extends keyof Omit<SettingDto, "id">>(
    key: Key,
    value: Omit<SettingDto, "id">[Key]
  ) => void;
}

export function SettingsTabsNotifications({
  setting,
  updateSetting,
}: SettingsTabsNotificationsProps) {
  const { t } = useTranslation("settings/settings-page");
  async function updateNotificationSetting(checked: boolean) {
    if (!checked) {
      updateSetting("enableNotifications", false);
      return;
    }

    if (!("Notification" in window)) {
      toast.error(t("toasts.notificationsUnsupported"));
      updateSetting("enableNotifications", false);
      return;
    }

    const permission =
      Notification.permission === "default"
        ? await Notification.requestPermission()
        : Notification.permission;

    if (permission !== "granted") {
      toast.error(t("toasts.notificationsDenied"));
      updateSetting("enableNotifications", false);
      return;
    }

    updateSetting("enableNotifications", true);
  }
  return (
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
            checked={setting.enableNotifications}
            onCheckedChange={(checked) => {
              void updateNotificationSetting(checked);
            }}
          />
        </SettingRow>

        <SettingRow title={t("fields.dailyReminder")} description={t("descriptions.dailyReminder")}>
          <Switch
            checked={setting.dailyReminder}
            onCheckedChange={(checked) => {
              updateSetting("dailyReminder", checked);
            }}
          />
        </SettingRow>

        <SettingRow title={t("fields.goalReminder")} description={t("descriptions.goalReminder")}>
          <Switch
            checked={setting.goalReminder}
            onCheckedChange={(checked) => {
              updateSetting("goalReminder", checked);
            }}
          />
        </SettingRow>

        <SettingRow
          title={t("fields.backupReminder")}
          description={t("descriptions.backupReminder")}
        >
          <Switch
            checked={setting.backupReminder}
            onCheckedChange={(checked) => {
              updateSetting("backupReminder", checked);
            }}
          />
        </SettingRow>
      </SettingSection>
    </TabsContent>
  );
}
