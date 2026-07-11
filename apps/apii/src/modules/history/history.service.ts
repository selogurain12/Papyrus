import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import { CreateHistoryDto, historyContract, HistoryDto, ListResult } from "@papyrus/source";
import { ProjectEntity } from "../projects/projects.entity";
import { HistoryMapper } from "./history.mapper";
import { HistoryEntity } from "./history.entity";

@Injectable()
export class HistoryService {
  private readonly orm: MikroORM;

  private readonly historyMapper: HistoryMapper;

  public constructor(orm: MikroORM, historyMapper: HistoryMapper) {
    this.orm = orm;
    this.historyMapper = historyMapper;
  }
  public async getAll(projectId: string): Promise<ListResult<HistoryDto>> {
    const em = this.orm.em.fork();
    const limit: number | undefined = undefined;
    const offset: number | undefined = undefined;
    const orderBy = { date: "DESC" };
    const qb = em.qb(HistoryEntity).where({ project: { id: projectId } });

    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await em.populate(items, ["project"]);

    return {
      data: await this.historyMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateHistoryDto, projectId: string): Promise<HistoryDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingProject = await repository.findOne({
        id: projectId,
      });
      if (!existingProject) {
        throw new TsRestException(historyContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.historyMapper.createDtoToEntity(parameters, projectId, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.historyMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(historyContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "HistoryEntity creation failed",
            },
          })
        : new TsRestException(historyContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "HistoryEntity creation failed",
            },
          });
    }
  }
}
