import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateNoteDto, NoteDto, UpdateNoteDto } from "@papyrus/source";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { NoteEntity } from "./note.entity";

@Injectable()
export class NoteMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: NoteEntity,
    projectId: string,
    em: EntityManager
  ): Promise<NoteDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: entity.id });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      tags: entity.tags,
      project: await this.projectMapper.entityToDto(projectEntity, em),
    };
  }

  public async entitiesToDtos(
    entities: NoteEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<NoteDto[]> {
    return await Promise.all(
      entities.map(async (entity) => this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateNoteDto,
    projectId: string,
    em: EntityManager
  ): Promise<NoteEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return new NoteEntity({
      title: createDto.title,
      content: createDto.content,
      tags: createDto.tags,
      project: projectEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateNoteDto,
    em: EntityManager
  ): Promise<NoteEntity> {
    const entity = await em.getRepository(NoteEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`NoteEntity with id ${id} not found`);
    }
    return em.assign(entity, {
      title: updateDto.title,
      content: updateDto.content,
      tags: updateDto.tags,
    });
  }
}
