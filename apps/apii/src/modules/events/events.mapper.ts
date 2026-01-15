import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateEventDto, EventDto, UpdateEventDto } from "@papyrus/source";
import { parseZonedDateTime } from "@internationalized/date";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { EventEntity } from "./events.entity";

@Injectable()
export class EventMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: EventEntity,
    projectId: string,
    em: EntityManager
  ): Promise<EventDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const projectDto = await this.projectMapper.entityToDto(projectEntity, em);
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      eventDate: entity.eventDate.toString(),
      importance: entity.importance,
      location: entity.location,
      additionalDetails: entity.additionalDetails,
      project: projectDto,
    };
  }

  public entitiesToDtos(
    entities: EventEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<EventDto[]> {
    return Promise.all(
      entities.map(async (entity) => await this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateEventDto,
    projectId: string,
    em: EntityManager
  ): Promise<EventEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const result = new EventEntity({
      title: createDto.title,
      description: createDto.description,
      eventDate: parseZonedDateTime(createDto.eventDate).set({ second: 0, millisecond: 0 }),
      location: createDto.location,
      additionalDetails: createDto.additionalDetails,
      project: projectEntity,
    });
    return result;
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateEventDto,
    em: EntityManager
  ): Promise<EventEntity> {
    const entity = await em.getRepository(EventEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }
    em.assign(entity, {
      title: updateDto.title,
      description: updateDto.description,
      eventDate:
        updateDto.eventDate === undefined
          ? entity.eventDate
          : parseZonedDateTime(updateDto.eventDate).set({ second: 0, millisecond: 0 }),
      location: updateDto.location,
      additionalDetails: updateDto.additionalDetails,
    });
    return entity;
  }
}
