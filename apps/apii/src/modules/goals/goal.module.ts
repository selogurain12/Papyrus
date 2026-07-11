import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProjectModule } from "../projects/projects.module";
import { HistoryModule } from "../history/history.module";
import { GoalController } from "./goal.controller";
import { GoalService } from "./goal.service";
import { GoalMapper } from "./goal.mapper";
import { GoalEntity } from "./goal.entity";
import { GoalStatusCronService } from "./goal-status-cron.service";

@Module({
  imports: [MikroOrmModule.forFeature([GoalEntity]), ProjectModule, HistoryModule],
  controllers: [GoalController],
  providers: [GoalService, GoalMapper, GoalStatusCronService],
  exports: [GoalService, GoalMapper],
})
export class GoalModule {}
