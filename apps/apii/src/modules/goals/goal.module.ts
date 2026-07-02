import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProjectModule } from "../projects/projects.module";
import { GoalController } from "./goal.controller";
import { GoalService } from "./goal.service";
import { GoalMapper } from "./goal.mapper";
import { GoalEntity } from "./goal.entity";

@Module({
  imports: [MikroOrmModule.forFeature([GoalEntity]), ProjectModule],
  controllers: [GoalController],
  providers: [GoalService, GoalMapper],
  exports: [GoalService, GoalMapper],
})
export class GoalModule {}
