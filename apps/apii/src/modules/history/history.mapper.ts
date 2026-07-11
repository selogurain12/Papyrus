import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreateHistoryDto, HistoryDto } from "@papyrus/source";
import { parseZonedDateTime } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { ProjectMapper } from "../projects/projects.mapper";
import { HistoryEntity } from "./history.entity";

@Injectable()
export class HistoryMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    historyEntity: HistoryEntity,
    projectId: string,
    em: EntityManager
  ): Promise<HistoryDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const projectDto = await this.projectMapper.entityToDto(projectEntity, em);
    return {
      id: historyEntity.id,
      type: historyEntity.type,
      entity: historyEntity.entity,
      title: historyEntity.title,
      date: historyEntity.date.toString(),
      project: projectDto,
    };
  }

  public async entitiesToDtos(
    entities: HistoryEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<HistoryDto[]> {
    return await Promise.all(
      entities.map(async (historyEntity) => await this.entityToDto(historyEntity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreateHistoryDto,
    projectId: string,
    em: EntityManager
  ): Promise<HistoryEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const result = new HistoryEntity({
      type: createDto.type,
      entity: createDto.entity,
      title: createDto.title,
      date: parseZonedDateTime(createDto.date).set({ second: 0, millisecond: 0 }),
      project: projectEntity,
    });
    return result;
  }
}
