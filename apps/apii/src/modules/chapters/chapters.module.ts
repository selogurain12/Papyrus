import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { PartModule } from "../part/part.module";
import { GoalModule } from "../goals/goal.module";
import { HistoryModule } from "../history/history.module";
import { ChapterController } from "./chapters.controller";
import { ChapterEntity } from "./chapters.entity";
import { ChapterMapper } from "./chapters.mapper";
import { ChapterService } from "./chapters.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([ChapterEntity]),
    ProjectModule,
    GoalModule,
    forwardRef(() => PartModule),
    HistoryModule,
  ],
  controllers: [ChapterController],
  providers: [ChapterService, ChapterMapper],
  exports: [ChapterService, ChapterMapper],
})
export class ChapterModule {}
