import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { ArchitectureEntity } from "./architecture.entity";
import { ArchitectureController } from "./architecture.controller";
import { ArchitectureService } from "./architecture.service";
import { ArchitectureMapper } from "./architecture.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([ArchitectureEntity]), ProjectModule],
  controllers: [ArchitectureController],
  providers: [ArchitectureService, ArchitectureMapper],
  exports: [ArchitectureService, ArchitectureMapper],
})
export class ArchitectureModule {}
