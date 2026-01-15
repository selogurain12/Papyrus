import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateResearchDto, ResearchDto, UpdateResearchDto } from "@papyrus/source";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { ResearchEntity } from "./research.entity";

@Injectable()
export class ResearchMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: ResearchEntity,
    projectId: string,
    em: EntityManager
  ): Promise<ResearchDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: entity.id });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return {
      id: entity.id,
      title: entity.title,
      type: entity.type,
      sources: entity.sources,
      tag: entity.tag,
      note: entity.note,
      link: entity.link,
      project: await this.projectMapper.entityToDto(projectEntity, em),
    };
  }

  public async entitiesToDtos(
    entities: ResearchEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<ResearchDto[]> {
    return await Promise.all(
      entities.map(async (entity) => this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateResearchDto,
    projectId: string,
    em: EntityManager
  ): Promise<ResearchEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return new ResearchEntity({
      title: createDto.title,
      type: createDto.type,
      sources: createDto.sources,
      tag: createDto.tag,
      note: createDto.note,
      link: createDto.link,
      project: projectEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateResearchDto,
    em: EntityManager
  ): Promise<ResearchEntity> {
    const entity = await em.getRepository(ResearchEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`ResearchEntity with id ${id} not found`);
    }
    return em.assign(entity, {
      title: updateDto.title,
      type: updateDto.type,
      sources: updateDto.sources,
      tag: updateDto.tag,
      note: updateDto.note,
      link: updateDto.link,
    });
  }
}
