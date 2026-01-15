import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { CharacterModule } from "../characters/characters.module";
import { RelationshipEntity } from "./relationship.entity";
import { RelationshipController } from "./relationship.controller";
import { RelationshipsService } from "./relationship.service";
import { RelationshipMapper } from "./relationship.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([RelationshipEntity]), ProjectModule, CharacterModule],
  controllers: [RelationshipController],
  providers: [RelationshipsService, RelationshipMapper],
  exports: [RelationshipsService, RelationshipMapper],
})
export class RelationshipModule {}
