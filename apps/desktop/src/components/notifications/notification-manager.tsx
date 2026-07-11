/* eslint-disable complexity */
import { GoalDto, queryKeys } from "@papyrus/source";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProject } from "../../context/project-provider";
import { client } from "../../utils/client/client";

type NotificationKind = "dailyWordGoal" | "activeGoals" | "backup";

const checkIntervalMs = 60 * 1000;
const dailyWordReminderHour = 18;
const goalReminderHour = 10;
const backupReminderHour = 20;

function getStorageKey(projectId: string, kind: NotificationKind, date: Date) {
  return `papyrus:notification:${projectId}:${kind}:${date.toISOString().slice(0, 10)}`;
}

function wasSentToday(projectId: string, kind: NotificationKind, date: Date) {
  return localStorage.getItem(getStorageKey(projectId, kind, date)) === "sent";
}

function markSent(projectId: string, kind: NotificationKind, date: Date) {
  localStorage.setItem(getStorageKey(projectId, kind, date), "sent");
}

function isAfterHour(date: Date, hour: number) {
  return date.getHours() >= hour;
}

function isBackupReminderDay(frequency: "daily" | "weekly" | "monthly", date: Date) {
  if (frequency === "daily") {
    return true;
  }

  if (frequency === "weekly") {
    return date.getDay() === 1;
  }

  return date.getDate() === 1;
}

function getMostRelevantGoal(goals: GoalDto[]) {
  const priority: Record<NonNullable<GoalDto["status"]>, number> = {
    overdue: 0,
    urgent: 1,
    warning: 2,
  };

  return [...goals].sort((firstGoal, secondGoal) => {
    const firstPriority = firstGoal.status ? priority[firstGoal.status] : 3;
    const secondPriority = secondGoal.status ? priority[secondGoal.status] : 3;

    return firstPriority - secondPriority;
  })[0];
}

function notify(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  new Notification(title, {
    body,
    silent: false,
  });
}

function sendDailyWordGoalNotification({
  projectId,
  wordsToday,
  dailyWordCountGoal,
  t,
  now,
}: {
  projectId: string;
  wordsToday: number;
  dailyWordCountGoal: number;
  t: ReturnType<typeof useTranslation>["t"];
  now: Date;
}) {
  if (
    wordsToday >= dailyWordCountGoal ||
    !isAfterHour(now, dailyWordReminderHour) ||
    wasSentToday(projectId, "dailyWordGoal", now)
  ) {
    return;
  }

  notify(
    t("dailyWordGoal.title"),
    t("dailyWordGoal.body", {
      remaining: Math.max(dailyWordCountGoal - wordsToday, 0).toLocaleString(),
      target: dailyWordCountGoal.toLocaleString(),
    })
  );
  markSent(projectId, "dailyWordGoal", now);
}

function sendActiveGoalsNotification({
  projectId,
  activeGoals,
  t,
  now,
}: {
  projectId: string;
  activeGoals: GoalDto[];
  t: ReturnType<typeof useTranslation>["t"];
  now: Date;
}) {
  if (
    activeGoals.length === 0 ||
    !isAfterHour(now, goalReminderHour) ||
    wasSentToday(projectId, "activeGoals", now)
  ) {
    return;
  }

  const goal = getMostRelevantGoal(activeGoals);

  notify(
    t("activeGoals.title", { count: activeGoals.length }),
    t("activeGoals.body", {
      count: activeGoals.length,
      title: goal.title,
    })
  );
  markSent(projectId, "activeGoals", now);
}

function sendBackupNotification({
  projectId,
  backupFrequency,
  t,
  now,
}: {
  projectId: string;
  backupFrequency: "daily" | "weekly" | "monthly";
  t: ReturnType<typeof useTranslation>["t"];
  now: Date;
}) {
  if (
    !isBackupReminderDay(backupFrequency, now) ||
    !isAfterHour(now, backupReminderHour) ||
    wasSentToday(projectId, "backup", now)
  ) {
    return;
  }

  notify(t("backup.title"), t("backup.body"));
  markSent(projectId, "backup", now);
}

export function NotificationManager() {
  const { t } = useTranslation("notifications/notification-manager");
  const { currentProject } = useProject();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const settings = currentProject?.settings;
  const projectId = currentProject?.id ?? "";
  const notificationsEnabled = Boolean(settings?.enableNotifications && projectId);

  const dashboardQuery = client.dashboard.get.useQuery({
    queryKey: queryKeys.dashboard.get({ pathParams: { projectId } }),
    queryData: {
      params: { projectId },
    },
    enabled: notificationsEnabled && Boolean(settings?.dailyReminder),
    refetchInterval: 5 * 60 * 1000,
  });

  const goalsQuery = client.goal.getAll.useQuery({
    queryKey: queryKeys.goal.getAll({
      pathParams: { projectId },
      query: { itemsPerPage: 100, page: 1 },
    }),
    queryData: {
      params: { projectId },
      query: { itemsPerPage: 100, page: 1 },
    },
    enabled: notificationsEnabled && Boolean(settings?.goalReminder),
    refetchInterval: 5 * 60 * 1000,
  });

  const wordsToday = useMemo(() => {
    const dailyProgress = dashboardQuery.data?.body.progress.find(
      (item) => item.label === "Mots aujourd'hui"
    );

    return dailyProgress?.value ?? 0;
  }, [dashboardQuery.data?.body.progress]);
  const hasDailyWordData = dashboardQuery.data !== undefined;

  const activeGoals = useMemo(
    () =>
      goalsQuery.data?.body.data.filter((goal) => goal.isOpen && goal.current < goal.goals) ?? [],
    [goalsQuery.data?.body.data]
  );

  useEffect(() => {
    if (!notificationsEnabled || !("Notification" in window)) {
      return;
    }

    if (Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!currentProject || !settings?.enableNotifications) {
      return;
    }

    const notificationProject = currentProject;
    const notificationSettings = settings;

    function checkNotifications() {
      if (!notificationSettings.enableNotifications) {
        return;
      }

      const now = new Date();

      if (notificationSettings.dailyReminder && hasDailyWordData) {
        sendDailyWordGoalNotification({
          projectId: notificationProject.id,
          wordsToday,
          dailyWordCountGoal: notificationSettings.dailyWordCountGoal,
          t,
          now,
        });
      }

      if (notificationSettings.goalReminder) {
        sendActiveGoalsNotification({
          projectId: notificationProject.id,
          activeGoals,
          t,
          now,
        });
      }

      if (notificationSettings.backupReminder) {
        sendBackupNotification({
          projectId: notificationProject.id,
          backupFrequency: notificationSettings.backupFrequency,
          t,
          now,
        });
      }
    }

    checkNotifications();
    intervalRef.current = setInterval(checkNotifications, checkIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeGoals, currentProject, hasDailyWordData, settings, t, wordsToday]);

  return null;
}
