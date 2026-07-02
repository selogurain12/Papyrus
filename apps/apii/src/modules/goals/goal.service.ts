import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateGoalDto,
  FilterDto,
  ListResult,
  goalContract,
  GoalDto,
  UpdateGoalDto,
} from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { fromDate } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { GoalMapper } from "./goal.mapper";
import { GoalEntity } from "./goal.entity";
import { ObjectEntity } from "../objects/objects.entity";

@Injectable()
export class GoalService {
  private readonly orm: MikroORM;

  private readonly goalsMapper: GoalMapper;

  public constructor(orm: MikroORM, goalsMapper: GoalMapper) {
    this.orm = orm;
    this.goalsMapper = goalsMapper;
  }

  public async get(id: string, projectId: string): Promise<GoalDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(GoalEntity);
    const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
    if (!item) {
      throw new TsRestException(goalContract.get, {
        status: 404,

        body: {
          error: "GoalNotFound",
          message: `GoalEntity with id ${id} not found`,
        },
      });
    }
    return await this.goalsMapper.entityToDto(item, projectId, em);
  }

  // eslint-disable-next-line complexity
  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<GoalDto>> {
    const em = this.orm.em.fork();
    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    const disablePagination = filter.disablePagination ?? false;
    if (!disablePagination) {
      limit = filter.itemsPerPage ?? 20;

      offset = ((filter.page ?? 1) - 1) * limit;
    }
    const orderBy = filter.orderBy ?? {
      name: "ASC",
    };
    let qb = em.qb(GoalEntity).where({ deletedAt: { $eq: null }, project: { id: projectId } });
    if (filter.search !== undefined) {
      qb = qb.andWhere({ name: { $like: `%${filter.search}%` } });
    }

    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    return {
      data: await this.goalsMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateGoalDto, projectId: string): Promise<GoalDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingProject = await repository.findOne({
        id: projectId,
      });
      if (!existingProject) {
        throw new TsRestException(goalContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.goalsMapper.createDtoToEntity(parameters, projectId, em);
      await em.persist(item).flush();
      await em.commit();
      return await this.goalsMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(goalContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "GoalEntity creation failed",
            },
          })
        : new TsRestException(goalContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "GoalEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateGoalDto,
    projectId: string
  ): Promise<GoalDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(GoalEntity);
      const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
      if (!item) {
        throw new TsRestException(goalContract.update, {
          status: 404,
          body: {
            error: "GoalNotFound",
            message: `GoalEntity with id ${id} not found`,
          },
        });
      }
      const updatedItem = await this.goalsMapper.updateDtoToEntity(id, updateDto, em);
      await em.persist(updatedItem).flush();
      await em.commit();
      return await this.goalsMapper.entityToDto(updatedItem, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(goalContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "GoalEntity update failed",
            },
          })
        : new TsRestException(goalContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "GoalEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(GoalEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(goalContract.delete, {
          status: 404,
          body: {
            error: "GoalNotFound",
            message: `GoalEntity with id ${id} not found`,
          },
        });
      }
      entity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(goalContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "GoalEntity deletion failed",
            },
          })
        : new TsRestException(goalContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "GoalEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(GoalEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(goalContract.delete, {
          status: 404,
          body: {
            error: "GoalNotFound",
            message: `GoalEntity with id ${id} not found`,
          },
        });
      }
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(goalContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "GoalEntity deletion failed",
            },
          })
        : new TsRestException(goalContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "GoalEntity deletion failed",
            },
          });
    }
  }
}
