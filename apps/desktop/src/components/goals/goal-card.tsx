/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { isFetchError } from "@ts-rest/react-query/v5";
import { toast } from "sonner";
import { AlertTriangle, Calendar, Check, Loader2, Pencil, Trash2 } from "lucide-react";
import { now, parseZonedDateTime } from "@internationalized/date";
import { GoalDto } from "@papyrus/source";
import { useTranslation } from "react-i18next";
import { client } from "../../utils/client/client";
import { queryClient } from "../../context/query-client";
import { format } from "../../utils/date/date-utils";
import { Badge } from "../ui/badge";
import { useOnlineStatus } from "../../hooks/use-online-status";
import { updateOfflineEntity } from "../../local-db/offline-entity-store";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getCalendarDayDiff = (fromDate: Date, toDate: Date) => {
  const fromDay = Date.UTC(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const toDay = Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

  return Math.round((toDay - fromDay) / DAY_IN_MS);
};

export const getDeadlineMessage = (
  goal: GoalDto,
  t: (key: string, options?: Record<string, unknown>) => string
): string | null => {
  const time = now("UTC");
  if (!goal.deadline) return null;
  const deadline = parseZonedDateTime(goal.deadline);
  const nowDate = time.toDate();
  const deadlineDate = deadline.toDate();
  const diff = deadlineDate.getTime() - nowDate.getTime();
  const daysUntil = getCalendarDayDiff(nowDate, deadlineDate);
  if (!goal.status) return null;

  if (goal.status === "overdue") {
    const daysOverdue = Math.ceil(Math.abs(diff) / DAY_IN_MS);
    return t("deadline.overdue", { count: daysOverdue });
  }

  if (goal.status === "urgent") {
    return daysUntil === 0 ? t("deadline.today") : t("deadline.tomorrow");
  }

  return t("deadline.warning", { count: daysUntil });
};

const getProgress = (goal: GoalDto) => {
  return Math.min((goal.current / goal.goals) * 100, 100);
};

// eslint-disable-next-line complexity
export function GoalCard({
  goal,
  setSelectedGoal,
  setIsUpdating,
  setIsDeleting,
}: {
  goal: GoalDto;
  setSelectedGoal: (goal: GoalDto) => void;
  setIsUpdating: (isUpdating: boolean) => void;
  setIsDeleting: (isDeleting: boolean) => void;
}) {
  const { t } = useTranslation("goals/goal-card");
  const isOnline = useOnlineStatus();
  const deadlineMessage = getDeadlineMessage(goal, t);
  const typeColorMap: Record<string, string> = {
    project: "bg-purple-100 text-purple-800",
    daily: "bg-green-100 text-green-800",
    weekly: "bg-blue-100 text-blue-800",
    monthly: "bg-yellow-100 text-yellow-800",
  };
  const progress = getProgress(goal);

  const getDeadlineColor = () => {
    if (goal.status === "overdue") return "border-red-500 bg-red-50 dark:bg-red-900/20";
    if (goal.status === "urgent") return "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
    if (goal.status === "warning") return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    return "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700";
  };
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  const getUnitLabel = (unit: string, value: number) => {
    switch (unit) {
      case "words":
        return t("units.words", { count: value });
      case "pages":
        return t("units.pages", { count: value });
      case "characters":
        return t("units.characters", { count: value });
      default:
        return unit;
    }
  };
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "project":
        return t("types.project");
      case "daily":
        return t("types.daily");
      case "weekly":
        return t("types.weekly");
      case "monthly":
        return t("types.monthly");
      default:
        return type;
    }
  };

  const { mutate, isPending } = client.goal.update.useMutation({
    onSuccess: () => {
      toast.success(t("toast.updateSuccess"));
      void queryClient.invalidateQueries({
        queryKey: ["goal.getAll"],
      });
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast.error(error.message);
      } else {
        toast.error(t("toast.error"));
      }
    },
  });

  async function markAsCompleted() {
    if (!goal.isOpen) {
      toast.error(t("toast.alreadyCompleted"));
      return;
    }
    if (!isOnline) {
      await updateOfflineEntity("goals", goal.project.id, goal, {
        ...goal,
        isOpen: false,
      });
      toast.success(t("toast.updateSuccess"));
      await queryClient.invalidateQueries({ queryKey: ["goal.getAll"] });
      return;
    }

    mutate({
      body: {
        ...goal,
        isOpen: false,
      },
      params: { projectId: goal.project.id, id: goal.id },
    });
  }

  return (
    <div
      key={goal.id}
      className={`rounded-xl shadow-sm border-2 p-6 transition-colors ${getDeadlineColor()}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
            <Badge
              className={`text-xs px-2 py-1 rounded-full font-medium ${typeColorMap[goal.type] || "bg-gray-100 text-gray-800"}`}
            >
              {getTypeLabel(goal.type)}
            </Badge>
            {goal.deadline && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {format(parseZonedDateTime(goal.deadline), "dd MMMM yyyy")}
              </span>
            )}
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h4>
          {goal.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
          )}
        </div>
        <div className="flex space-x-1 ml-4">
          <button
            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
            disabled={isPending}
            title={t("actions.markCompleted")}
            onClick={markAsCompleted}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
          <button
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            disabled={isPending}
            title={t("actions.update")}
            onClick={() => {
              setSelectedGoal(goal);
              setIsUpdating(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            disabled={isPending}
            title={t("actions.delete")}
            onClick={() => {
              setSelectedGoal(goal);
              setIsDeleting(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {deadlineMessage && (
        <div
          className={`mb-4 p-3 rounded-lg border flex items-center space-x-2 ${
            // eslint-disable-next-line no-nested-ternary
            goal.status === "overdue"
              ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-200"
              : goal.status === "urgent"
                ? "bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/40 dark:border-orange-700 dark:text-orange-200"
                : "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-700 dark:text-yellow-200"
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium">{deadlineMessage}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t("progress")}</span>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`${getProgressColor(progress)} h-4 rounded-full transition-all duration-500 relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-900 dark:text-white">
            {goal.current.toLocaleString()} / {goal.goals.toLocaleString()}{" "}
            {getUnitLabel(goal.unit, goal.goals)}
          </span>
          {goal.goals > goal.current && (
            <span className="text-gray-600 dark:text-gray-400">
              {t("remaining", { value: (goal.goals - goal.current).toLocaleString() })}
            </span>
          )}
        </div>

        {progress >= 75 && progress < 100 && !goal.status && (
          <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              {t("encouragement.prefix")}{" "}
              <span className="font-semibold">
                {(goal.goals - goal.current).toLocaleString()}{" "}
                {getUnitLabel(goal.unit, goal.goals - goal.current)}
              </span>{" "}
              {t("encouragement.suffix")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
