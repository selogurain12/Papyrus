import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { CharacterController } from "./characters.controller";
import { CharacterEntity } from "./characters.entity";
import { CharacterMapper } from "./characters.mapper";
import { CharacterService } from "./characters.service";

@Module({
  imports: [MikroOrmModule.forFeature([CharacterEntity]), ProjectModule],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterMapper],
  exports: [CharacterService, CharacterMapper],
})
export class CharacterModule {}
