import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateMindMapDto, MindMapDto, UpdateMindMapDto } from "@papyrus/source";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { MindmapEntity } from "./mindmap.entity";

@Injectable()
export class MindmapMapper {
  private readonly projectMapper: ProjectMapper;
  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: MindmapEntity,
    projectId: string,
    em: EntityManager
  ): Promise<MindMapDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return {
      id: entity.id,
      title: entity.title,
      type: entity.type,
      project: await this.projectMapper.entityToDto(projectEntity, em),
    };
  }

  public async entitiesToDtos(
    entities: MindmapEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<MindMapDto[]> {
    return await Promise.all(
      entities.map(async (entity) => this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateMindMapDto,
    projectId: string,
    em: EntityManager
  ): Promise<MindmapEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return new MindmapEntity({
      title: createDto.title,
      type: createDto.type,
      project: projectEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateMindMapDto,
    em: EntityManager
  ): Promise<MindmapEntity> {
    const entity = await em.getRepository(MindmapEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`MindmapEntity with id ${id} not found`);
    }
    return em.assign(entity, {
      title: updateDto.title,
      type: updateDto.type,
    });
  }
}
