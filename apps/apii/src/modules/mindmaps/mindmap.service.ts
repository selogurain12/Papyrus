import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateMindMapDto,
  FilterDto,
  ListResult,
  mindmapContract,
  MindMapDto,
  UpdateMindMapDto,
} from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { fromDate } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { MindmapMapper } from "./mindmap.mapper";
import { MindmapEntity } from "./mindmap.entity";

@Injectable()
export class MindmapService {
  private readonly orm: MikroORM;

  private readonly mindMapMapper: MindmapMapper;

  public constructor(orm: MikroORM, mindMapMapper: MindmapMapper) {
    this.orm = orm;
    this.mindMapMapper = mindMapMapper;
  }

  public async get(id: string, projectId: string): Promise<MindMapDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(MindmapEntity);
    const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
    if (!item) {
      throw new TsRestException(mindmapContract.get, {
        status: 404,

        body: {
          error: "MindMapNotFound",
          message: `MindmapEntity with id ${id} not found`,
        },
      });
    }
    return await this.mindMapMapper.entityToDto(item, projectId, em);
  }
  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<MindMapDto>> {
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
    let qb = em.qb(MindmapEntity).where({ deletedAt: { $eq: null }, project: { id: projectId } });
    if (filter.search !== undefined) {
      qb = qb.andWhere({ name: { $like: `%${filter.search}%` } });
    }

    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await em.populate(items, ["project"]);

    return {
      data: await this.mindMapMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateMindMapDto, projectId: string): Promise<MindMapDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingProject = await repository.findOne({
        id: projectId,
      });
      if (!existingProject) {
        throw new TsRestException(mindmapContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.mindMapMapper.createDtoToEntity(parameters, projectId, em);
      await em.persist(item).flush();
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.mindMapMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(mindmapContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "MindmapEntity creation failed",
            },
          })
        : new TsRestException(mindmapContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "MindmapEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateMindMapDto,
    projectId: string
  ): Promise<MindMapDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(MindmapEntity);
      const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
      if (!item) {
        throw new TsRestException(mindmapContract.update, {
          status: 404,
          body: {
            error: "MindMapNotFound",
            message: `MindmapEntity with id ${id} not found`,
          },
        });
      }
      const updatedItem = await this.mindMapMapper.updateDtoToEntity(id, updateDto, em);
      await em.persist(updatedItem).flush();
      await em.commit();
      await em.populate(updatedItem, ["project"]);
      return await this.mindMapMapper.entityToDto(updatedItem, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(mindmapContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "MindmapEntity update failed",
            },
          })
        : new TsRestException(mindmapContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "MindmapEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(MindmapEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(mindmapContract.delete, {
          status: 404,
          body: {
            error: "MindMapNotFound",
            message: `MindmapEntity with id ${id} not found`,
          },
        });
      }
      entity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(mindmapContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "MindmapEntity deletion failed",
            },
          })
        : new TsRestException(mindmapContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "MindmapEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(MindmapEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(mindmapContract.delete, {
          status: 404,
          body: {
            error: "MindMapNotFound",
            message: `MindmapEntity with id ${id} not found`,
          },
        });
      }
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(mindmapContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "MindmapEntity deletion failed",
            },
          })
        : new TsRestException(mindmapContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "MindmapEntity deletion failed",
            },
          });
    }
  }
}
