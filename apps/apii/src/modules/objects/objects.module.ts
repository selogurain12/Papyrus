import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ProjectModule } from "../projects/projects.module";
import { ObjectController } from "./objects.controller";
import { ObjectService } from "./objects.service";
import { ObjectMapper } from "./objects.mapper";
import { ObjectEntity } from "./objects.entity";

@Module({
  imports: [MikroOrmModule.forFeature([ObjectEntity]), ProjectModule],
  controllers: [ObjectController],
  providers: [ObjectService, ObjectMapper],
  exports: [ObjectService, ObjectMapper],
})
export class ObjectModule {}
