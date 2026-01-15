import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateRelationshipDto,
  FilterDto,
  ListResult,
  relationshipContract,
  RelationshipDto,
  UpdateRelationshipDto,
} from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { fromDate } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { RelationshipMapper } from "./relationship.mapper";
import { RelationshipEntity } from "./relationship.entity";

@Injectable()
export class RelationshipsService {
  private readonly orm: MikroORM;

  private readonly relationshipMapper: RelationshipMapper;

  public constructor(orm: MikroORM, relationshipMapper: RelationshipMapper) {
    this.orm = orm;
    this.relationshipMapper = relationshipMapper;
  }

  public async get(id: string, projectId: string): Promise<RelationshipDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(RelationshipEntity);
    const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
    if (!item) {
      throw new TsRestException(relationshipContract.get, {
        status: 404,

        body: {
          error: "RelationshipNotFound",
          message: `Relationship with id ${id} not found`,
        },
      });
    }
    return await this.relationshipMapper.entityToDto(item, projectId, em);
  }
  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<RelationshipDto>> {
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
    let qb = em
      .qb(RelationshipEntity)
      .where({ deletedAt: { $eq: null }, project: { id: projectId } });
    if (filter.search !== undefined) {
      qb = qb.andWhere({ name: { $like: `%${filter.search}%` } });
    }

    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await em.populate(items, ["childRelation", "parentRelation", "project"]);

    return {
      data: await this.relationshipMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(
    parameters: CreateRelationshipDto,
    projectId: string
  ): Promise<RelationshipDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingProject = await repository.findOne({
        id: projectId,
      });
      if (!existingProject) {
        throw new TsRestException(relationshipContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.relationshipMapper.createDtoToEntity(parameters, projectId, em);
      await em.persist(item).flush();
      await em.commit();
      await em.populate(item, ["childRelation", "parentRelation", "project"]);
      return await this.relationshipMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(relationshipContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Relationship creation failed",
            },
          })
        : new TsRestException(relationshipContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Relationship creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateRelationshipDto,
    projectId: string
  ): Promise<RelationshipDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(RelationshipEntity);
      const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
      if (!item) {
        throw new TsRestException(relationshipContract.update, {
          status: 404,
          body: {
            error: "RelationshipNotFound",
            message: `Relationship with id ${id} not found`,
          },
        });
      }
      const updatedItem = await this.relationshipMapper.updateDtoToEntity(id, updateDto, em);
      await em.persist(updatedItem).flush();
      await em.commit();
      await em.populate(updatedItem, ["childRelation", "parentRelation", "project"]);
      return await this.relationshipMapper.entityToDto(updatedItem, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(relationshipContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Relationship update failed",
            },
          })
        : new TsRestException(relationshipContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Relationship update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(RelationshipEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(relationshipContract.delete, {
          status: 404,
          body: {
            error: "RelationshipNotFound",
            message: `Relationship with id ${id} not found`,
          },
        });
      }
      entity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(relationshipContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Relationship deletion failed",
            },
          })
        : new TsRestException(relationshipContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Relationship deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(RelationshipEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(relationshipContract.delete, {
          status: 404,
          body: {
            error: "RelationshipNotFound",
            message: `Relationship with id ${id} not found`,
          },
        });
      }
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(relationshipContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Relationship deletion failed",
            },
          })
        : new TsRestException(relationshipContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Relationship deletion failed",
            },
          });
    }
  }
}
