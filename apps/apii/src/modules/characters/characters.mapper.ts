import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CharacterDto, CreateCharacterDto, UpdateCharacterDto } from "@papyrus/source";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { CharacterEntity } from "./characters.entity";

@Injectable()
export class CharacterMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: CharacterEntity,
    projectId: string,
    em: EntityManager
  ): Promise<CharacterDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const projectDto = await this.projectMapper.entityToDto(projectEntity, em);
    return {
      id: entity.id,
      name: entity.name,
      role: entity.role,
      description: entity.description,
      age: entity.age,
      appearance: entity.appearance,
      personality: entity.personality,
      story: entity.story,
      motivation: entity.motivation,
      color: entity.color,
      project: projectDto,
    };
  }

  public async entitiesToDtos(
    entities: CharacterEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<CharacterDto[]> {
    return await Promise.all(
      entities.map(async (entity) => await this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateCharacterDto,
    projectId: string,
    em: EntityManager
  ): Promise<CharacterEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const result = new CharacterEntity({
      name: createDto.name,
      role: createDto.role,
      description: createDto.description,
      age: createDto.age,
      appearance: createDto.appearance,
      personality: createDto.personality,
      story: createDto.story,
      motivation: createDto.motivation,
      color: createDto.color,
      project: projectEntity,
    });
    return result;
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateCharacterDto,
    em: EntityManager
  ): Promise<CharacterEntity> {
    const entity = await em.getRepository(CharacterEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`CharacterEntity with id ${id} not found`);
    }
    em.assign(entity, {
      name: updateDto.name,
      role: updateDto.role,
      description: updateDto.description,
      age: updateDto.age,
      appearance: updateDto.appearance,
      personality: updateDto.personality,
      story: updateDto.story,
      motivation: updateDto.motivation,
      color: updateDto.color,
    });
    return entity;
  }
}
