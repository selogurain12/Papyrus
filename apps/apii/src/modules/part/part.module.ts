import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { PartEntity } from "./part.entity";
import { PartController } from "./part.controller";
import { PartService } from "./part.service";
import { PartMapper } from "./part.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([PartEntity]), ProjectModule],
  controllers: [PartController],
  providers: [PartService, PartMapper],
  exports: [PartService, PartMapper],
})
export class PartModule {}
