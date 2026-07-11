import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProjectModule } from "../projects/projects.module";
import { HistoryController } from "./history.controller";
import { HistoryEntity } from "./history.entity";
import { HistoryMapper } from "./history.mapper";
import { HistoryService } from "./history.service";

@Module({
  imports: [MikroOrmModule.forFeature([HistoryEntity]), ProjectModule],
  controllers: [HistoryController],
  providers: [HistoryService, HistoryMapper],
  exports: [HistoryService, HistoryMapper],
})
export class HistoryModule {}
