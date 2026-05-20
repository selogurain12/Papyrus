import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { ChapterModule } from "../chapters/chapters.module";
import { PartModule } from "../part/part.module";
import { ExportController } from "./export.controller";
import { ExportService } from "./export.service";

@Module({
  imports: [ProjectModule, ChapterModule, PartModule],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
