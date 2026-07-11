import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ChapterEntity } from "../chapters/chapters.entity";
import { CharacterEntity } from "../characters/characters.entity";
import { EventEntity } from "../events/events.entity";
import { NoteEntity } from "../notes/note.entity";
import { ObjectEntity } from "../objects/objects.entity";
import { PartEntity } from "../part/part.entity";
import { PlaceEntity } from "../places/place.entity";
import { ProjectEntity } from "../projects/projects.entity";
import { ResearchEntity } from "../research/research.entity";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([
      ChapterEntity,
      CharacterEntity,
      EventEntity,
      NoteEntity,
      ObjectEntity,
      PartEntity,
      PlaceEntity,
      ProjectEntity,
      ResearchEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
