import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { ChapterModule } from "../chapters/chapters.module";
import { PartModule } from "../part/part.module";
import { CharacterModule } from "../characters/characters.module";
import { ObjectModule } from "../objects/objects.module";
import { PlaceModule } from "../places/place.module";
import { NoteModule } from "../notes/note.module";
import { ResearchModule } from "../research/research.module";
import { EventModule } from "../events/events.module";
import { HistoryModule } from "../history/history.module";
import { ExportService } from "./export.service";
import { ExportController } from "./export.controller";

@Module({
  imports: [
    ProjectModule,
    ChapterModule,
    PartModule,
    CharacterModule,
    ObjectModule,
    PlaceModule,
    NoteModule,
    ResearchModule,
    EventModule,
    HistoryModule,
  ],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
