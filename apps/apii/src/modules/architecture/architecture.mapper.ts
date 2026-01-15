import { Injectable } from "@nestjs/common";
import { ArchitectureDto, CreateArchitectureDto, UpdateArchitectureDto } from "@papyrus/source";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { ArchitectureEntity } from "./architecture.entity";

@Injectable()
export class ArchitectureMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: ArchitectureEntity,
    projectId: string,
    em: EntityManager
  ): Promise<ArchitectureDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const { id, firstIdea, plan, environnement } = entity;
    return {
      id,
      firstIdea,
      plan,
      environnement,
      project: await this.projectMapper.entityToDto(projectEntity, em),
    };
  }

  public async entitiesToDtos(
    entities: ArchitectureEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<ArchitectureDto[]> {
    return await Promise.all(
      entities.map(async (entity) => await this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateArchitectureDto,
    projectId: string,
    em: EntityManager
  ): Promise<ArchitectureEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return new ArchitectureEntity({
      firstIdea: createDto.firstIdea,
      plan: createDto.plan,
      environnement: createDto.environnement,
      project: projectEntity,
    });
  }

  public async updateDtoToEntity(
    architectureId: string,
    updateDto: UpdateArchitectureDto,
    projectId: string,
    em: EntityManager
  ): Promise<ArchitectureEntity> {
    const entity = await em
      .getRepository(ArchitectureEntity)
      .findOne({ id: architectureId, project: { id: { $eq: projectId } } });
    if (!entity) {
      throw new NotFoundError(`ArchitectureEntity with id ${architectureId} not found`);
    }
    return em.assign(entity, {
      firstIdea: updateDto.firstIdea,
      plan: updateDto.plan,
      environnement: updateDto.environnement,
    });
  }
}
