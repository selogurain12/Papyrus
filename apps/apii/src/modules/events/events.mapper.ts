import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateEventDto, EventDto, UpdateEventDto } from "@papyrus/source";
import { parseZonedDateTime } from "@internationalized/date";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { ChapterMapper } from "../chapters/chapters.mapper";
import { ChapterEntity } from "../chapters/chapters.entity";
import { EventEntity } from "./events.entity";

@Injectable()
export class EventMapper {
  private readonly projectMapper: ProjectMapper;

  private readonly chapterMapper: ChapterMapper;

  public constructor(projectMapper: ProjectMapper, chapterMapper: ChapterMapper) {
    this.projectMapper = projectMapper;
    this.chapterMapper = chapterMapper;
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

    const chapterRef = entity.chapter;
    const chapterEntity = chapterRef
      ? await em.getRepository(ChapterEntity).findOne({ id: chapterRef.id })
      : null;

    if (chapterRef && !chapterEntity) {
      throw new NotFoundError(`ChapterEntity with id ${chapterRef.id} not found`);
    }
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      eventDate: entity.eventDate.toString(),
      importance: entity.importance,
      location: entity.location,
      additionalDetails: entity.additionalDetails,
      project: projectDto,
      chapter: chapterEntity
        ? await this.chapterMapper.entityToDto(chapterEntity, projectId, em)
        : null,
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
    const chapterEntity = createDto.chapter
      ? await em.getRepository(ChapterEntity).findOne({ id: createDto.chapter.id })
      : null;

    if (createDto.chapter && !chapterEntity) {
      throw new NotFoundError(`ChapterEntity with id ${createDto.chapter.id} not found`);
    }

    const result = new EventEntity({
      title: createDto.title,
      description: createDto.description,
      eventDate: parseZonedDateTime(createDto.eventDate).set({ second: 0, millisecond: 0 }),
      location: createDto.location,
      additionalDetails: createDto.additionalDetails,
      importance: createDto.importance,
      project: projectEntity,
      chapter: chapterEntity ?? null,
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
    let chapter: ChapterEntity | null | undefined = undefined;

    if (updateDto.chapter !== undefined) {
      if (updateDto.chapter === null) {
        chapter = null;
      } else {
        chapter = await em.getRepository(ChapterEntity).findOne({
          id: updateDto.chapter.id,
          deletedAt: null,
        });

        if (!chapter) {
          throw new NotFoundError(`PartEntity with id ${updateDto.chapter.id} not found`);
        }
      }
    }
    em.assign(entity, {
      title: updateDto.title,
      description: updateDto.description,
      eventDate:
        updateDto.eventDate === undefined
          ? entity.eventDate
          : parseZonedDateTime(updateDto.eventDate).set({ second: 0, millisecond: 0 }),
      location: updateDto.location,
      importance: updateDto.importance,
      additionalDetails: updateDto.additionalDetails,
      chapter,
    });
    return entity;
  }
}
