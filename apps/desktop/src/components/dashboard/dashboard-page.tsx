/* eslint-disable max-lines */
/* eslint-disable complexity */
import {
  BookOpen,
  Calendar,
  FileText,
  MapPin,
  Package,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { queryKeys } from "@papyrus/source";
import { useNavigate } from "@tanstack/react-router";
import { parseZonedDateTime } from "@internationalized/date";
import { useTranslation } from "react-i18next";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { characterRoute } from "../../routes/character/index.route";
import { chapterRoute } from "../../routes/chapter/index.route";
import { placeRoute } from "../../routes/place/index.route";
import { objectRoute } from "../../routes/object/index.route";
import { eventRoute } from "../../routes/event/index.route";
import { noteRoute } from "../../routes/note/index.route";
import { format } from "../../utils/date/date-utils";
import { formatDistanceToNow } from "../../utils/date/format-distance";

const summaryIcons = {
  bookOpen: BookOpen,
  users: Users,
  mapPin: MapPin,
  calendar: Calendar,
};

const summaryColorClasses = {
  blue: "bg-blue-600",
  purple: "bg-violet-600",
  green: "bg-emerald-600",
  orange: "bg-amber-600",
};

const progressColorClasses = {
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  purple: "bg-violet-600",
  orange: "bg-amber-600",
};

const quickActions = [
  {
    labelKey: "quickActions.newCharacter",
    icon: Users,
    route: characterRoute,
    color: "hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700",
  },
  {
    labelKey: "quickActions.newChapter",
    icon: BookOpen,
    route: chapterRoute,
    color: "hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700",
  },
  {
    labelKey: "quickActions.newPlace",
    icon: MapPin,
    route: placeRoute,
    color: "hover:border-violet-500 hover:bg-violet-50 hover:text-violet-700",
  },
  {
    labelKey: "quickActions.newObject",
    icon: Package,
    route: objectRoute,
    color: "hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700",
  },
  {
    labelKey: "quickActions.timelineEvent",
    icon: Calendar,
    route: eventRoute,
    color: "hover:border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700",
  },
  {
    labelKey: "quickActions.newNote",
    icon: FileText,
    route: noteRoute,
    color: "hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700",
  },
];

export function DashboardPage() {
  const { currentProject } = useProject();
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard/dashboard-page");
  const projectId = currentProject?.id ?? "";
  const projectName = currentProject?.title ?? "";

  const { data, isLoading } = client.dashboard.get.useQuery({
    queryKey: queryKeys.dashboard.get({ pathParams: { projectId } }),
    queryData: {
      params: { projectId },
    },
    enabled: projectId.length > 0,
  });

  const { data: goalsData } = client.goal.getAll.useQuery({
    queryKey: queryKeys.goal.getAll({ pathParams: { projectId } }),
    queryData: {
      params: { projectId },
    },
    enabled: projectId.length > 0,
  });

  const { data: historyData } = client.history.getAll.useQuery({
    queryKey: queryKeys.history.getAll({ pathParams: { projectId } }),
    queryData: {
      params: { projectId },
    },
    enabled: projectId.length > 0,
  });

  const goals = goalsData?.body.data.filter((goal) => goal.isOpen) ?? [];

  const dashboard = data?.body;
  const summaryLabelKeys: Record<string, string> = {
    "Mots écrits": "summary.wordsWritten",
    Personnages: "summary.characters",
    "Lieux créés": "summary.placesCreated",
    Chapitres: "summary.chapters",
  };
  const summaryChangeKeys: Record<string, string> = {
    "aujourd'hui": "summaryChange.today",
    "cette semaine": "summaryChange.thisWeek",
    récemment: "summaryChange.recently",
    "en cours": "summaryChange.inProgress",
  };
  const progressLabelKeys: Record<string, string> = {
    "Mots aujourd'hui": "progress.wordsToday",
    "Chapitres cette semaine": "progress.chaptersThisWeek",
    "Personnages développés": "progress.developedCharacters",
    "Lieux détaillés": "progress.detailedPlaces",
  };

  const translateSummaryChange = (change: string) => {
    const match = change.match(/^([+]?[\d\s.,]+)\s+(.+)$/u);

    if (!match) {
      return change;
    }

    const [, value, label] = match;
    const key = summaryChangeKeys[label];

    return key ? t(key, { value }) : change;
  };

  if (!currentProject) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6 text-muted-foreground">
            {t("currentProjectMissing")}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !dashboard) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-64 rounded-md bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 rounded-xl border border-gray-300 bg-muted/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">{t("title")}</h2>
        <p className="text-muted-foreground">
          {t("subtitle", { projectTitle: currentProject.title })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboard.summaryCards.map((stat) => {
          const Icon = summaryIcons[stat.icon];
          return (
            <Card key={stat.label} className="rounded-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div
                    className={`w-12 h-12 ${summaryColorClasses[stat.color]} rounded-lg flex
                      items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-muted-foreground text-sm font-medium">
                      {t(summaryLabelKeys[stat.label] ?? stat.label)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-emerald-600 font-medium">
                  {translateSummaryChange(stat.change)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="rounded-lg">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">{t("sections.currentGoals")}</CardTitle>
            <Target className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id}>
                <div className="flex justify-between gap-3 text-sm mb-2">
                  <span className="text-foreground font-medium">{goal.title}</span>
                  <span className="text-muted-foreground">
                    {Math.min((goal.current / goal.goals) * 100, 100)}%
                  </span>
                </div>
                <Progress
                  value={Math.min((goal.current / goal.goals) * 100, 100)}
                  className="mb-1"
                />
                {goal.deadline && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    {format(parseZonedDateTime(goal.deadline), "dd MMMM yyyy")}
                  </span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">{t("sections.progress")}</CardTitle>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.progress.map((stat) => {
              const width = Math.min(100, Math.round((stat.value / stat.target) * 100));
              return (
                <div key={stat.label}>
                  <div className="flex justify-between gap-3 text-sm text-muted-foreground mb-2">
                    <span>{t(progressLabelKeys[stat.label] ?? stat.label)}</span>
                    <span>
                      {stat.value} / {stat.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${progressColorClasses[stat.color]} h-2 rounded-full
                        transition-all`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">{t("sections.recentActivity")}</CardTitle>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {historyData?.body.data.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("emptyActivity")}</p>
              ) : (
                historyData?.body.data.map((activity, index) => (
                  <div
                    key={`${activity.entity}-${index}`}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted
                      transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        activity.type === "create" ? "bg-emerald-500" : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium">{activity.title}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {formatDistanceToNow(parseZonedDateTime(activity.date))}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg">{t("sections.quickActions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.labelKey}
                  variant="outline"
                  className={`h-24 flex-col gap-2 border-dashed whitespace-normal
                    text-center ${action.color}`}
                  onClick={() => {
                    void navigate({ to: action.route.to, params: { name: projectName } });
                  }}
                >
                  <Icon className="w-7 h-7" />
                  <span className="text-xs leading-tight">{t(action.labelKey)}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <section
        className="rounded-lg border border-blue-200 bg-linear-to-r from-blue-50
          to-violet-50 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-950">{t("sections.writingStreak")}</h3>
          <span className="text-2xl font-bold text-blue-700">
            {t("streakDays", { count: dashboard.writingStreak.days })}
          </span>
        </div>
        <p className="text-gray-700 mb-4">
          {dashboard.writingStreak.days > 0 ? t("streakActive") : t("streakInactive")}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-blue-600 to-violet-600 h-3 rounded-full"
              style={{ width: `${dashboard.writingStreak.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {dashboard.writingStreak.currentWordCount.toLocaleString("fr-FR")} /{" "}
            {dashboard.writingStreak.targetWordCount.toLocaleString()} {t("words")}
          </span>
        </div>
      </section>
    </div>
  );
}
