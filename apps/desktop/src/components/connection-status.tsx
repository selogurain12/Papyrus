/* eslint-disable max-len */
import { Cloud, CloudOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "../lib/utils";
import { useOnlineStatus } from "../hooks/use-online-status";

export function ConnectionStatus() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();
  const Icon = isOnline ? Cloud : CloudOff;

  return (
    <div
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium",
        isOnline
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300"
      )}
      role="status"
      aria-live="polite"
    >
      <Icon className="h-4 w-4" />
      <span>{isOnline ? t("connection.online") : t("connection.offline")}</span>
    </div>
  );
}
