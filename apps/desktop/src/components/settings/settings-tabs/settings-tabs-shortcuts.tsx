/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { Label } from "@radix-ui/react-label";
import { Trash2, Plus, RefreshCw } from "lucide-react";
import {
  defaultShortcuts,
  ShortcutActionOption,
  shortcutActions,
} from "../../../utils/shortcut-actions";
import { acceleratorToDisplay, getAcceleratorFromKeyboardEvent } from "../../../utils/shortcut-key";
import { Input } from "../../ui/input";
import { SingleSelector } from "../../ui/single-select";
import { TabsContent } from "../../ui/tabs/tab-content";
import { SettingRow } from "../settings-components/settings-row";
import { SettingSection } from "../settings-components/settings-section";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { SettingDto } from "@papyrus/source";
import { useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

interface SettingsTabsShortcutsProps {
  setting: Omit<SettingDto, "id">;

  updateSetting: <Key extends keyof Omit<SettingDto, "id">>(
    key: Key,
    value: Omit<SettingDto, "id">[Key]
  ) => void;
}

export function SettingsTabsShortcuts({ setting, updateSetting }: SettingsTabsShortcutsProps) {
  const { t } = useTranslation("settings/settings-page");
  const [shortcutAction, setShortcutAction] = useState<ShortcutActionOption | undefined>();
  const [shortcutValue, setShortcutValue] = useState("");
  function handleDeleteShortcut(id: string) {
    updateSetting(
      "shortcuts",
      setting.shortcuts.filter((shortcut) => shortcut.id !== id)
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

  function handleAddShortcut() {
    const shortcut = shortcutValue.trim();

    if (!shortcutAction || !shortcut) {
      return;
    }

    updateSetting("shortcuts", [
      ...setting.shortcuts,
      {
        id: `${shortcutAction.id}:${crypto.randomUUID()}`,
        label: shortcutAction.label,
        shortcut,
      },
    ]);
    setShortcutAction(undefined);
    setShortcutValue("");
  }

  const translatedDefaultShortcuts = defaultShortcuts.map((shortcut) => ({
    ...shortcut,
    label: t(`shortcuts.defaults.${shortcut.id}`, { defaultValue: shortcut.label }),
  }));

  return (
    <TabsContent value="shortcuts" className="mt-0 space-y-6">
      <SettingSection
        title={t("sections.shortcuts.title")}
        description={t("sections.shortcuts.description")}
      >
        {setting.shortcuts.map((shortcut) => (
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
                onClick={() => {
                  handleDeleteShortcut(shortcut.id);
                }}
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
              id="settings-shortcut"
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
          onClick={() => {
            updateSetting("shortcuts", translatedDefaultShortcuts);
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("actions.restoreShortcuts")}
        </Button>
      </SettingSection>
    </TabsContent>
  );
}
