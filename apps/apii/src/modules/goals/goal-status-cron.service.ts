import { MikroORM } from "@mikro-orm/postgresql";
import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { GoalEntity } from "./goal.entity";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const GOAL_STATUS_TIME_ZONE = "Europe/Paris";

type GoalStatus = GoalEntity["status"];

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: GOAL_STATUS_TIME_ZONE,
  year: "numeric",
});

const getTimeZoneDay = (date: Date) => {
  const parts = dateFormatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  return Date.UTC(year, month - 1, day);
};

const getCalendarDayDiff = (fromDate: Date, toDate: Date) => {
  return Math.round((getTimeZoneDay(toDate) - getTimeZoneDay(fromDate)) / DAY_IN_MS);
};

const getGoalStatusFromDeadline = (deadline: Date, currentDate: Date): GoalStatus => {
  const daysUntilDeadline = getCalendarDayDiff(currentDate, deadline);

  if (daysUntilDeadline < 0) {
    return "overdue";
  }

  if (daysUntilDeadline <= 1) {
    return "urgent";
  }

  if (daysUntilDeadline <= 5) {
    return "warning";
  }

  return null;
};

@Injectable()
export class GoalStatusCronService {
  private readonly logger = new Logger(GoalStatusCronService.name);

  private readonly orm: MikroORM;

  public constructor(orm: MikroORM) {
    this.orm = orm;
  }

  @Cron("0 0 * * *", { timeZone: GOAL_STATUS_TIME_ZONE })
  public async updateGoalStatuses(): Promise<void> {
    const em = this.orm.em.fork();
    const currentDate = new Date();
    const goals = await em.find(GoalEntity, {
      deadline: { $ne: null },
      deletedAt: { $eq: null },
      isOpen: true,
    });

    let updatedGoalsCount = 0;

    for (const goal of goals) {
      if (!goal.deadline) {
        continue;
      }

      const nextStatus = getGoalStatusFromDeadline(goal.deadline.toDate(), currentDate);

      if (goal.status !== nextStatus) {
        goal.status = nextStatus;
        updatedGoalsCount += 1;
      }
    }

    if (updatedGoalsCount > 0) {
      await em.flush();
    }

    this.logger.log(`Updated ${updatedGoalsCount} goal deadline status(es).`);
  }
}
