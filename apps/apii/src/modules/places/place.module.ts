import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { PlaceEntity } from "./place.entity";
import { PlaceController } from "./place.controller";
import { PlaceService } from "./place.service";
import { PlaceMapper } from "./place.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([PlaceEntity]), ProjectModule],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceMapper],
  exports: [PlaceService, PlaceMapper],
})
export class PlaceModule {}
