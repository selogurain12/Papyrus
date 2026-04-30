import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { StructureEntity } from "./structure.entity";
import { StructureController } from "./structure.controller";
import { StructureService } from "./structure.service";
import { StructureMapper } from "./structure.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([StructureEntity])],
  controllers: [StructureController],
  providers: [StructureService, StructureMapper],
  exports: [StructureService, StructureMapper],
})
export class StructureModule {}
