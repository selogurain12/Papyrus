import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { S3Module } from "../s3/s3.module";
import { HistoryModule } from "../history/history.module";
import { ResearchEntity } from "./research.entity";
import { ResearchController } from "./research.controller";
import { ResearchService } from "./research.service";
import { ResearchMapper } from "./research.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([ResearchEntity]), ProjectModule, S3Module, HistoryModule],
  controllers: [ResearchController],
  providers: [ResearchService, ResearchMapper],
  exports: [ResearchService, ResearchMapper],
})
export class ResearchModule {}
