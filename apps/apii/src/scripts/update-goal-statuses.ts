import * as dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { GoalStatusCronService } from "../modules/goals/goal-status-cron.service";

dotenv.config();

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const goalStatusCronService = app.get(GoalStatusCronService);
    await goalStatusCronService.updateGoalStatuses();
  } finally {
    await app.close();
  }
}

void main();
