import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProjectModule } from "../projects/projects.module";
import { HistoryModule } from "../history/history.module";
import { MindmapEntity } from "./mindmap.entity";
import { MindmapController } from "./mindmap.controller";
import { MindmapService } from "./mindmap.service";
import { MindmapMapper } from "./mindmap.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([MindmapEntity]), ProjectModule, HistoryModule],
  controllers: [MindmapController],
  providers: [MindmapService, MindmapMapper],
  exports: [MindmapService, MindmapMapper],
})
export class MindmapModule {}
