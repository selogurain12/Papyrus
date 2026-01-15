import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateRelationshipDto, RelationshipDto, UpdateRelationshipDto } from "@papyrus/source";
import { CharacterEntity } from "../characters/characters.entity";
import { CharacterMapper } from "../characters/characters.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { ProjectMapper } from "../projects/projects.mapper";
import { RelationshipEntity } from "./relationship.entity";

@Injectable()
export class RelationshipMapper {
  private readonly characterMapper: CharacterMapper;

  private readonly projectMapper: ProjectMapper;

  public constructor(characterMapper: CharacterMapper, projectMapper: ProjectMapper) {
    this.characterMapper = characterMapper;
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: RelationshipEntity,
    projectId: string,
    em: EntityManager
  ): Promise<RelationshipDto> {
    const parentRelationEntity = await em
      .getRepository(CharacterEntity)
      .findOne({ id: entity.parentRelation.id });
    if (!parentRelationEntity) {
      throw new NotFoundError(`CharacterEntity with id ${entity.parentRelation.id} not found`);
    }
    const childRelationEntity = await em
      .getRepository(CharacterEntity)
      .findOne({ id: entity.childRelation.id });
    if (!childRelationEntity) {
      throw new NotFoundError(`CharacterEntity with id ${entity.childRelation.id} not found`);
    }
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return {
      id: entity.id,
      type: entity.type,
      childRelation: await this.characterMapper.entityToDto(childRelationEntity, projectId, em),
      parentRelation: await this.characterMapper.entityToDto(parentRelationEntity, projectId, em),
      project: await this.projectMapper.entityToDto(projectEntity, em),
    };
  }

  public async entitiesToDtos(
    entities: RelationshipEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<RelationshipDto[]> {
    return await Promise.all(
      entities.map(async (entity) => this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateRelationshipDto,
    projectId: string,
    em: EntityManager
  ): Promise<RelationshipEntity> {
    const parentRelationEntity = await em
      .getRepository(CharacterEntity)
      .findOne({ id: createDto.parentRelation.id });
    if (!parentRelationEntity) {
      throw new NotFoundError(`CharacterEntity with id ${createDto.parentRelation.id} not found`);
    }
    const childRelationEntity = await em
      .getRepository(CharacterEntity)
      .findOne({ id: createDto.childRelation.id });
    if (!childRelationEntity) {
      throw new NotFoundError(`CharacterEntity with id ${createDto.childRelation.id} not found`);
    }
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return new RelationshipEntity({
      type: createDto.type,
      childRelation: childRelationEntity,
      parentRelation: parentRelationEntity,
      project: projectEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateRelationshipDto,
    em: EntityManager
  ): Promise<RelationshipEntity> {
    const entity = await em.getRepository(RelationshipEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`Relationship with id ${id} not found`);
    }
    let parentRelationEntity: CharacterEntity | undefined = undefined;
    if (updateDto.parentRelation) {
      const parentRelation = await em
        .getRepository(CharacterEntity)
        .findOne({ id: { $eq: updateDto.parentRelation.id } });
      if (!parentRelation) {
        throw new NotFoundError(`CharacterEntity with id ${updateDto.parentRelation.id} not found`);
      }
      parentRelationEntity = parentRelation;
    }
    let childRelationEntity: CharacterEntity | undefined = undefined;
    if (updateDto.childRelation) {
      const childRelation = await em
        .getRepository(CharacterEntity)
        .findOne({ id: { $eq: updateDto.childRelation.id } });
      if (!childRelation) {
        throw new NotFoundError(`CharacterEntity with id ${updateDto.childRelation.id} not found`);
      }
      childRelationEntity = childRelation;
    }
    return em.assign(entity, {
      type: updateDto.type,
      childRelation: childRelationEntity,
      parentRelation: parentRelationEntity,
    });
  }
}
