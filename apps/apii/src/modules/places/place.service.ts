import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import {
  CreatePlaceDto,
  FilterDto,
  ListResult,
  placeContract,
  PlaceDto,
  UpdatePlaceDto,
} from "@papyrus/source";
import { fromDate } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { PlaceMapper } from "./place.mapper";
import { PlaceEntity } from "./place.entity";

@Injectable()
export class PlaceService {
  private readonly orm: MikroORM;

  private readonly placeMapper: PlaceMapper;

  public constructor(orm: MikroORM, placeMapper: PlaceMapper) {
    this.orm = orm;
    this.placeMapper = placeMapper;
  }

  public async get(id: string, projectId: string) {
    const em = this.orm.em.fork();
    const repository = em.getRepository(PlaceEntity);
    const item = await repository.findOne({ id: id, project: { id: { $eq: projectId } } });
    if (!item) {
      throw new TsRestException(placeContract.get, {
        status: 404,

        body: {
          error: "PlaceNotFound",
          message: `PlaceEntity with id ${id} not found`,
        },
      });
    }
    return await this.placeMapper.entityToDto(item, projectId, em);
  }

  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<PlaceDto>> {
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

    const qb = em.qb(PlaceEntity).where({ project: { id: projectId } });
    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    return {
      data: await this.placeMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreatePlaceDto, projectId: string): Promise<PlaceDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const project = await repository.findOne({ id: projectId });
      if (!project) {
        throw new TsRestException(placeContract.create, {
          status: 404,

          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.placeMapper.createDtoToEntity(parameters, projectId, em);
      await em.persist(item).flush();
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.placeMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(placeContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PlaceEntity creation failed",
            },
          })
        : new TsRestException(placeContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PlaceEntity creation failed",
            },
          });
    }
  }

  public async update(id: string, updateDto: UpdatePlaceDto, projectId: string): Promise<PlaceDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(PlaceEntity);
      const existingEntity = await repository.findOne(
        { id: id, project: { id: { $eq: projectId } } },
        { populate: ["project"] }
      );
      if (!existingEntity) {
        throw new TsRestException(placeContract.update, {
          status: 404,

          body: {
            error: "PlaceNotFound",
            message: `PlaceEntity with id ${id} not found`,
          },
        });
      }
      const item = await this.placeMapper.updateDtoToEntity(id, updateDto, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.placeMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(placeContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PlaceEntity update failed",
            },
          })
        : new TsRestException(placeContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PlaceEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(PlaceEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id: id }, { project: { id: { $eq: projectId } } }, { deletedAt: null }],
      });
      if (!existingEntity) {
        throw new TsRestException(placeContract.delete, {
          status: 404,

          body: {
            error: "PlaceNotFound",
            message: `PlaceEntity with id ${id} not found`,
          },
        });
      }
      existingEntity.deletedAt = fromDate(new Date(), "UTC");
      em.persist(existingEntity);
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(placeContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PlaceEntity deletion failed",
            },
          })
        : new TsRestException(placeContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PlaceEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(PlaceEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id: id }, { project: { id: { $eq: projectId } } }],
      });
      if (!existingEntity) {
        throw new TsRestException(placeContract.delete, {
          status: 404,

          body: {
            error: "PlaceNotFound",
            message: `PlaceEntity with id ${id} not found`,
          },
        });
      }
      em.remove(existingEntity);
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(placeContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PlaceEntity deletion failed",
            },
          })
        : new TsRestException(placeContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PlaceEntity deletion failed",
            },
          });
    }
  }
}
