import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { ChapterDto, CreateChapterDto, UpdateChapterDto } from "@papyrus/source";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { PartEntity } from "../part/part.entity";
import { PartMapper } from "../part/part.mapper";
import { ChapterEntity } from "./chapters.entity";

@Injectable()
export class ChapterMapper {
  private readonly projectMapper: ProjectMapper;

  private readonly partMapper: PartMapper;

  public constructor(projectMapper: ProjectMapper, partMapper: PartMapper) {
    this.projectMapper = projectMapper;
    this.partMapper = partMapper;
  }
  public async entityToDto(
    entity: ChapterEntity,
    projectId: string,
    em: EntityManager
  ): Promise<ChapterDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const partEntity = await em.getRepository(PartEntity).findOne({ id: entity.part.id });
    if (!partEntity) {
      throw new NotFoundError(`PartEntity with id ${entity.part.id} not found`);
    }
    return {
      id: entity.id,
      title: entity.title,
      status: entity.status,
      content: entity.content,
      resume: entity.resume,
      chapterNumber: entity.chapterNumber,
      wordCount: entity.wordCount,
      wordGoal: entity.wordGoal,
      project: await this.projectMapper.entityToDto(projectEntity, em),
      part: await this.partMapper.entityToDto(partEntity, projectId, em),
    };
  }

  public async entitiesToDtos(
    entities: ChapterEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<ChapterDto[]> {
    return await Promise.all(
      entities.map(async (entity) => await this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateChapterDto,
    projectId: string,
    em: EntityManager
  ): Promise<ChapterEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const partEntity = await em.getRepository(PartEntity).findOne({ id: createDto.part.id });
    if (!partEntity) {
      throw new NotFoundError(`PartEntity with id ${createDto.part.id} not found`);
    }
    const result = new ChapterEntity({
      title: createDto.title,
      status: createDto.status,
      content: createDto.content,
      resume: createDto.resume,
      chapterNumber: createDto.chapterNumber,
      wordCount: createDto.wordCount,
      wordGoal: createDto.wordGoal,
      project: projectEntity,
      part: partEntity,
    });
    return result;
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateChapterDto,
    em: EntityManager
  ): Promise<ChapterEntity> {
    const entity = await em.getRepository(ChapterEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`ChapterEntity with id ${id} not found`);
    }
    let part: PartEntity | null = null;

    if (updateDto.part) {
      part = await em.getRepository(PartEntity).findOne({
        id: {
          $eq: updateDto.part.id,
        },
      });

      if (!part) {
        throw new NotFoundError(`PartEntity with id ${id} not found`);
      }
    }
    em.assign(entity, {
      title: updateDto.title,
      status: updateDto.status,
      content: updateDto.content,
      resume: updateDto.resume,
      chapterNumber: updateDto.chapterNumber,
      wordCount: updateDto.wordCount,
      wordGoal: updateDto.wordGoal,
      part,
    });
    return entity;
  }
}
