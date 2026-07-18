import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { HistoryModule } from "../history/history.module";
import { ChapterModule } from "../chapters/chapters.module";
import { EventEntity } from "./events.entity";
import { EventController } from "./events.controller";
import { EventService } from "./events.service";
import { EventMapper } from "./events.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([EventEntity]), ProjectModule, HistoryModule, ChapterModule],
  controllers: [EventController],
  providers: [EventService, EventMapper],
  exports: [EventService, EventMapper],
})
export class EventModule {}
