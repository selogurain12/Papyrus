import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreatePartDto, PartDto, UpdatePartDto } from "@papyrus/source";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { PartEntity } from "./part.entity";

@Injectable()
export class PartMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: PartEntity,
    projectId: string,
    em: EntityManager
  ): Promise<PartDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return {
      id: entity.id,
      title: entity.title,
      status: entity.status,
      project: await this.projectMapper.entityToDto(projectEntity, em),
    };
  }

  public async entitiesToDtos(
    entities: PartEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<PartDto[]> {
    return await Promise.all(
      entities.map(async (entity) => this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreatePartDto,
    projectId: string,
    em: EntityManager
  ): Promise<PartEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return new PartEntity({
      title: createDto.title,
      status: createDto.status,
      project: projectEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdatePartDto,
    em: EntityManager
  ): Promise<PartEntity> {
    const entity = await em.getRepository(PartEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`PartEntity with id ${id} not found`);
    }
    return em.assign(entity, {
      title: updateDto.title,
      status: updateDto.status,
    });
  }
}
