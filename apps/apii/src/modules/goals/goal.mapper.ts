import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateGoalDto, GoalDto, UpdateGoalDto } from "@papyrus/source";
import { ProjectEntity } from "../projects/projects.entity";
import { ProjectMapper } from "../projects/projects.mapper";
import { GoalEntity } from "./goal.entity";

@Injectable()
export class GoalMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: GoalEntity,
    projectId: string,
    em: EntityManager
  ): Promise<GoalDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const projectDto = await this.projectMapper.entityToDto(projectEntity, em);
    return {
      id: entity.id,
      type: entity.type,
      description: entity.description,
      title: entity.title,
      unit: entity.unit,
      deadline: entity.deadline,
      status: entity.status,
      project: projectDto,
    };
  }

  public async entitiesToDtos(
    entities: GoalEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<GoalDto[]> {
    return await Promise.all(
      entities.map(async (entity) => await this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateGoalDto,
    projectId: string,
    em: EntityManager
  ): Promise<GoalEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const result = new GoalEntity({
      deadline: createDto.deadline,
      description: createDto.description,
      title: createDto.title,
      unit: createDto.unit,
      goals: createDto.goals,
      project: projectEntity,
    });
    return result;
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateGoalDto,
    em: EntityManager
  ): Promise<GoalEntity> {
    const goalEntity = await em.getRepository(GoalEntity).findOne({ id });
    if (!goalEntity) {
      throw new NotFoundError(`GoalEntity with id ${id} not found`);
    }
    em.assign(goalEntity, {
      title: updateDto.title,
      description: updateDto.description,
      unit: updateDto.unit,
      goals: updateDto.goals,
      deadline: updateDto.deadline,
      status: updateDto.status,
    });
    return goalEntity;
  }
}
