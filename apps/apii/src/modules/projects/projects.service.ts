/* eslint-disable max-lines */
import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import {
  FilterProjectDto,
  projectContract,
  ProjectDto,
  ListResult,
  CreateProjectDto,
  UpdateProjectDto,
} from "@papyrus/source";
import { fromDate, now } from "@internationalized/date";
import { UserEntity } from "../users/users.entity";
import { ProjectMapper } from "./projects.mapper";
import { ProjectEntity } from "./projects.entity";

@Injectable()
export class ProjectService {
  private readonly orm: MikroORM;

  private readonly projectMapper: ProjectMapper;

  public constructor(orm: MikroORM, projectMapper: ProjectMapper) {
    this.orm = orm;
    this.projectMapper = projectMapper;
  }

  public async get(id: string, userId: string): Promise<ProjectDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(ProjectEntity);
    const item = await repository.findOne({ id, user: { id: userId } });
    if (!item) {
      throw new TsRestException(projectContract.get, {
        status: 404,

        body: {
          error: "ProjectNotFound",
          message: `ProjectEntity with id ${id} not found`,
        },
      });
    }
    return await this.projectMapper.entityToDto(item, em);
  }

  // eslint-disable-next-line complexity
  public async getAll(filter: FilterProjectDto, userId: string): Promise<ListResult<ProjectDto>> {
    const em = this.orm.em.fork();

    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    const disablePagination = filter.disablePagination ?? false;
    if (!disablePagination) {
      limit = filter.itemsPerPage ?? 20;

      offset = ((filter.page ?? 1) - 1) * limit;
    }
    const orderBy = filter.orderBy ?? {
      createdAt: "DESC",
    };

    let qb = em.qb(ProjectEntity).where({ deletedAt: { $eq: null }, user: { id: userId } });

    if (filter.genre !== undefined && filter.genre.length > 0) {
      qb = qb.andWhere({ genre: { $in: filter.genre } });
    }

    if (filter.fromDeadline !== undefined) {
      qb = qb.andWhere({
        deadline: { $gte: fromDate(new Date(filter.fromDeadline), "UTC") },
      });
    }

    if (filter.toDeadline !== undefined) {
      qb = qb.andWhere({
        deadline: { $lte: fromDate(new Date(filter.toDeadline), "UTC") },
      });
    }

    if (filter.status !== undefined && filter.status.length > 0) {
      qb = qb.andWhere({ status: { $in: filter.status } });
    }

    if (filter.minTargetWordCount !== undefined) {
      qb = qb.andWhere({
        targetWordCount: { $gte: filter.minTargetWordCount },
      });
    }

    if (filter.maxTargetWordCount !== undefined) {
      qb = qb.andWhere({
        targetWordCount: { $lte: filter.maxTargetWordCount },
      });
    }

    if (filter.toDeadline !== undefined) {
      qb = qb.andWhere({
        deadline: { $lte: fromDate(new Date(filter.toDeadline), "UTC") },
      });
    }

    if (filter.search !== undefined) {
      qb = qb.andWhere({
        $or: [
          { name: { $ilike: `%${filter.search}%` } },
          { description: { $ilike: `%${filter.search}%` } },
        ],
      });
    }

    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await em.populate(items, ["user", "settings"]);

    return {
      data: await this.projectMapper.entitiesToDtos(items, em),
      total,
    };
  }

  public async create(parameters: CreateProjectDto, userId: string): Promise<ProjectDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(UserEntity);
      const user = await repository.findOne({
        id: userId,
      });
      if (!user) {
        throw new TsRestException(projectContract.create, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `UserEntity with id ${parameters.user.id} not found`,
          },
        });
      }
      const item = await this.projectMapper.createDtoToEntity(parameters, userId, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["user", "settings"]);
      return await this.projectMapper.entityToDto(item, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(projectContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ProjectEntity creation failed",
            },
          })
        : new TsRestException(projectContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ProjectEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateProjectDto,
    userId: string
  ): Promise<ProjectDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingEntity = await repository.findOne(
        { id, user: { id: userId } },
        { populate: ["user", "settings"] }
      );
      if (!existingEntity) {
        throw new TsRestException(projectContract.update, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${id} not found`,
          },
        });
      }
      const item = this.projectMapper.updateDtoToEntity(existingEntity, updateDto, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["user", "settings"]);
      return await this.projectMapper.entityToDto(item, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(projectContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ProjectEntity update failed",
            },
          })
        : new TsRestException(projectContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ProjectEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(ProjectEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, user: { id: userId } }],
      });
      if (!entity) {
        throw new TsRestException(projectContract.delete, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${id} not found`,
          },
        });
      }
      em.assign(entity, { deletedAt: now("UTC") });
      em.persist(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(projectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ProjectEntity deletion failed",
            },
          })
        : new TsRestException(projectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ProjectEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, userId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(ProjectEntity);
      const entity = await repository.findOne({
        id,
        user: { id: userId },
      });
      if (!entity) {
        throw new TsRestException(projectContract.delete, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${id} not found`,
          },
        });
      }
      em.remove(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(projectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ProjectEntity deletion failed",
            },
          })
        : new TsRestException(projectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ProjectEntity deletion failed",
            },
          });
    }
  }
}
