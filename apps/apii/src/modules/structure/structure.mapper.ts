import { Injectable } from "@nestjs/common";
import { StructureDto, UpdateStructureDto } from "@papyrus/source";
import { EntityManager } from "@mikro-orm/postgresql";
import { StructureEntity } from "./structure.entity";

@Injectable()
export class StructureMapper {
  public entityToDto(entity: StructureEntity): StructureDto {
    return {
      id: entity.id,
      premise: entity.premise,
      genre: entity.genre,
      theme: entity.theme,
      structure: entity.structure,
      objectives: entity.objectives,
    };
  }

  public createDtoToEntity(): StructureEntity {
    return new StructureEntity();
  }

  public updateDtoToEntity(
    entity: StructureEntity,
    updateDto: UpdateStructureDto,
    em: EntityManager
  ): StructureEntity {
    const { premise, genre, theme, structure, objectives } = updateDto;
    return em.assign(entity, {
      premise,
      genre,
      theme,
      structure,
      objectives,
    });
  }
}
