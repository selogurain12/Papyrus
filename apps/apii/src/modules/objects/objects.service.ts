import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateObjectDto,
  FilterObjectDto,
  ListResult,
  objectContract,
  ObjectDto,
  UpdateObjectDto,
} from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { fromDate } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { ObjectMapper } from "./objects.mapper";
import { ObjectEntity } from "./objects.entity";

@Injectable()
export class ObjectService {
  private readonly orm: MikroORM;

  private readonly objectsMapper: ObjectMapper;

  public constructor(orm: MikroORM, objectsMapper: ObjectMapper) {
    this.orm = orm;
    this.objectsMapper = objectsMapper;
  }

  public async get(id: string, projectId: string): Promise<ObjectDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(ObjectEntity);
    const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
    if (!item) {
      throw new TsRestException(objectContract.get, {
        status: 404,

        body: {
          error: "ObjectNotFound",
          message: `ObjectEntity with id ${id} not found`,
        },
      });
    }
    return await this.objectsMapper.entityToDto(item, projectId, em);
  }

  // eslint-disable-next-line complexity
  public async getAll(filter: FilterObjectDto, projectId: string): Promise<ListResult<ObjectDto>> {
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
    let qb = em.qb(ObjectEntity).where({ deletedAt: { $eq: null }, project: { id: projectId } });
    if (filter.importance !== undefined && filter.importance.length > 0) {
      qb = qb.andWhere({ importance: { $eq: filter.importance } });
    }
    if (filter.characters !== undefined && filter.characters.length > 0) {
      qb = qb.andWhere({ characters: { $in: filter.characters } });
    }
    if (filter.events !== undefined && filter.events.length > 0) {
      qb = qb.andWhere({ events: { $in: filter.events } });
    }
    if (filter.search !== undefined) {
      qb = qb.andWhere({ name: { $like: `%${filter.search}%` } });
    }

    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    return {
      data: await this.objectsMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateObjectDto, projectId: string): Promise<ObjectDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingProject = await repository.findOne({
        id: projectId,
      });
      if (!existingProject) {
        throw new TsRestException(objectContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.objectsMapper.createDtoToEntity(parameters, projectId, em);
      await em.persist(item).flush();
      await em.commit();
      return await this.objectsMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(objectContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ObjectEntity creation failed",
            },
          })
        : new TsRestException(objectContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ObjectEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateObjectDto,
    projectId: string
  ): Promise<ObjectDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ObjectEntity);
      const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
      if (!item) {
        throw new TsRestException(objectContract.update, {
          status: 404,
          body: {
            error: "ObjectNotFound",
            message: `ObjectEntity with id ${id} not found`,
          },
        });
      }
      const updatedItem = await this.objectsMapper.updateDtoToEntity(id, updateDto, em);
      await em.persist(updatedItem).flush();
      await em.commit();
      return await this.objectsMapper.entityToDto(updatedItem, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(objectContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ObjectEntity update failed",
            },
          })
        : new TsRestException(objectContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ObjectEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(ObjectEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(objectContract.delete, {
          status: 404,
          body: {
            error: "ObjectNotFound",
            message: `ObjectEntity with id ${id} not found`,
          },
        });
      }
      entity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(objectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ObjectEntity deletion failed",
            },
          })
        : new TsRestException(objectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ObjectEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(ObjectEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(objectContract.delete, {
          status: 404,
          body: {
            error: "ObjectNotFound",
            message: `ObjectEntity with id ${id} not found`,
          },
        });
      }
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(objectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ObjectEntity deletion failed",
            },
          })
        : new TsRestException(objectContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ObjectEntity deletion failed",
            },
          });
    }
  }
}
