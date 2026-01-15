import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateObjectDto, ObjectDto, UpdateObjectDto } from "@papyrus/source";
import { ProjectEntity } from "../projects/projects.entity";
import { ProjectMapper } from "../projects/projects.mapper";
import { ObjectEntity } from "./objects.entity";

@Injectable()
export class ObjectMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: ObjectEntity,
    projectId: string,
    em: EntityManager
  ): Promise<ObjectDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const projectDto = await this.projectMapper.entityToDto(projectEntity, em);
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      appearance: entity.appearance,
      color: entity.color,
      history: entity.history,
      importance: entity.importance,
      location: entity.location,
      significance: entity.significance,
      type: entity.type,
      project: projectDto,
    };
  }

  public async entitiesToDtos(
    entities: ObjectEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<ObjectDto[]> {
    return await Promise.all(
      entities.map(async (entity) => await this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateObjectDto,
    projectId: string,
    em: EntityManager
  ): Promise<ObjectEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const result = new ObjectEntity({
      name: createDto.name,
      description: createDto.description,
      appearance: createDto.appearance,
      importance: createDto.importance,
      location: createDto.location,
      significance: createDto.significance,
      type: createDto.type,
      history: createDto.history,
      color: createDto.color,
      project: projectEntity,
    });
    return result;
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateObjectDto,
    em: EntityManager
  ): Promise<ObjectEntity> {
    const objectEntity = await em.getRepository(ObjectEntity).findOne({ id });
    if (!objectEntity) {
      throw new NotFoundError(`ObjectEntity with id ${id} not found`);
    }
    em.assign(objectEntity, {
      name: updateDto.name,
      description: updateDto.description,
      appearance: updateDto.appearance,
      importance: updateDto.importance,
      location: updateDto.location,
      significance: updateDto.significance,
      type: updateDto.type,
      history: updateDto.history,
      color: updateDto.color,
    });
    return objectEntity;
  }
}
