/* eslint-disable max-len */
/* eslint-disable max-lines */
import { Award, Calendar, Check, Plus, Target, Trash2, TrendingUp } from "lucide-react";
import { GoalDto, queryKeys } from "@papyrus/source";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { client } from "../../utils/client/client";
import { useProject } from "../../context/project-provider";
import { cn } from "../../lib/utils";
import { useFilterGoalDto } from "../../utils/filters/use-filter-goal";
import { Dialog } from "../ui/dialogs/dialog";
import { CreateGoalForm } from "./actions/create-goal";
import { UpdateGoalForm } from "./actions/update-goal";
import { GoalDeleteActions } from "./actions/delete-goal";
import { GoalCard } from "./goal-card";

const statCardColors = {
  blue: {
    card: "bg-blue-100 border-blue-300",
    icon: "bg-blue-500 text-white",
  },
  green: {
    card: "bg-green-100 border-green-300",
    icon: "bg-green-500 text-white",
  },
  orange: {
    card: "bg-orange-100 border-orange-300",
    icon: "bg-orange-500 text-white",
  },
  yellow: {
    card: "bg-yellow-100 border-yellow-300",
    icon: "bg-yellow-500 text-white",
  },
};

const types: Array<{ value: string; labelKey: string }> = [
  { value: "all", labelKey: "filters.all" },
  { value: "daily", labelKey: "types.daily" },
  { value: "weekly", labelKey: "types.weekly" },
  { value: "monthly", labelKey: "types.monthly" },
  { value: "project", labelKey: "types.project" },
];

interface StatGoalsCardProps {
  icon: typeof Target;
  titleKey: string;
  value: number | string;
  color: keyof typeof statCardColors;
}

const StatGoalsCard = ({ icon: Icon, titleKey, value, color }: StatGoalsCardProps) => {
  const colors = statCardColors[color];
  const { t } = useTranslation("goals/goals-page");

  return (
    <Card className={cn("flex items-center border p-4 w-full", colors.card)}>
      <div className={cn("mr-4 rounded-xl p-3", colors.icon)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-base font-semibold">{t(titleKey)}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </Card>
  );
};

const getProgress = (goal: GoalDto) => {
  return Math.min((goal.current / goal.goals) * 100, 100);
};

const getStatsGoals = (goals: GoalDto[]): StatGoalsCardProps[] => {
  const openGoals = goals.filter((goal) => goal.isOpen);
  const completedGoals = goals.filter((goal) => !goal.isOpen);
  const dailyGoals = goals.filter((goal) => goal.type === "daily");
  const averageProgress = Math.round(
    openGoals.reduce((acc, goal) => acc + getProgress(goal), 0) / Math.max(openGoals.length, 1)
  );

  return [
    {
      icon: Target,
      titleKey: "stats.activeGoals",
      value: openGoals.length,
      color: "blue",
    },
    {
      icon: Calendar,
      titleKey: "stats.dailyGoals",
      value: dailyGoals.length,
      color: "green",
    },
    {
      icon: TrendingUp,
      titleKey: "stats.averageProgress",
      value: `${averageProgress}%`,
      color: "orange",
    },
    {
      icon: Award,
      titleKey: "stats.completedGoals",
      value: completedGoals.length,
      color: "yellow",
    },
  ];
};

// eslint-disable-next-line complexity
export function GoalPage() {
  const { t } = useTranslation("goals/goals-page");
  const { currentProject } = useProject();
  const [activeType, setActiveType] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalDto | null>(null);
  const { options, setType } = useFilterGoalDto({
    itemsPerPage: 20,
    page: 1,
    orderBy: { createdAt: "desc" },
  });
  const { data } = client.goal.getAll.useQuery({
    queryKey: queryKeys.goal.getAll({
      pathParams: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    }),
    queryData: {
      params: { projectId: currentProject?.id ?? "" },
      query: { ...options },
    },
  });
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "bg-purple-100 text-purple-800";
      case "daily":
        return "bg-green-100 text-green-800";
      case "weekly":
        return "bg-blue-100 text-blue-800";
      case "monthly":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "";
    }
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
  const completedGoals = data?.body.data.filter((goal) => !goal.isOpen);
  const openGoals = data?.body.data.filter((goal) => goal.isOpen);
  const statsGoals = getStatsGoals(data?.body.data ?? []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="text-md">{t("subtitle")}</p>
        </div>
        <div>
          <Button
            variant="blue"
            onClick={() => {
              setIsCreating(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("newGoal")}
          </Button>
        </div>
      </div>
      <div>
        <div className="flex justify-between gap-3">
          {statsGoals.map((stat) => (
            <StatGoalsCard
              key={stat.titleKey}
              icon={stat.icon}
              titleKey={stat.titleKey}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => {
              setActiveType(type.value);
              setType(
                type.value === "all"
                  ? undefined
                  : (type.value as "daily" | "weekly" | "monthly" | "project")
              );
            }}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              activeType === type.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {t(type.labelKey)}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="font-bold mb-4">{t("sections.activeGoals")}</h2>
        <div className="space-y-4 grid grid-cols-2 gap-2">
          {openGoals?.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t("emptyGoals")}</div>
          ) : (
            openGoals?.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                setSelectedGoal={setSelectedGoal}
                setIsUpdating={setIsUpdating}
                setIsDeleting={setIsDeleting}
              />
            ))
          )}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="font-bold mb-4 flex">
          <Award color="orange" />
          {t("sections.completedGoals")}
        </h2>
        <div className="space-y-4 grid grid-cols-2 gap-2">
          {completedGoals?.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t("emptyGoals")}</div>
          ) : (
            completedGoals?.map((goal) => (
              <div
                key={goal.id}
                className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(goal.type)}`}
                      >
                        {getTypeLabel(goal.type)}
                      </span>
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{goal.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t("completedGoalProgress", {
                        value: goal.goals.toLocaleString(),
                        unit: getUnitLabel(goal.unit, goal.goals),
                      })}
                    </p>
                  </div>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors ml-4"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setIsDeleting(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {isCreating && (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <CreateGoalForm setOpen={setIsCreating} />
        </Dialog>
      )}
      {isUpdating && selectedGoal && (
        <Dialog open={isUpdating} onOpenChange={setIsUpdating}>
          <UpdateGoalForm setOpen={setIsUpdating} goal={selectedGoal} />
        </Dialog>
      )}
      {isDeleting && selectedGoal && (
        <Dialog
          open={isDeleting}
          onOpenChange={() => {
            setIsDeleting(false);
          }}
        >
          <GoalDeleteActions
            setOpen={() => {
              setIsDeleting(false);
            }}
            goal={selectedGoal}
            open={isDeleting}
          />
        </Dialog>
      )}
    </div>
  );
}
