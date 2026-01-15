import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  architectureContract,
  ArchitectureDto,
  CreateArchitectureDto,
  FilterDto,
  ListResult,
  UpdateArchitectureDto,
} from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { ProjectEntity } from "../projects/projects.entity";
import { ArchitectureMapper } from "./architecture.mapper";
import { ArchitectureEntity } from "./architecture.entity";

@Injectable()
export class ArchitectureService {
  private readonly orm: MikroORM;

  private readonly architectureMapper: ArchitectureMapper;

  public constructor(orm: MikroORM, architectureMapper: ArchitectureMapper) {
    this.orm = orm;
    this.architectureMapper = architectureMapper;
  }

  public async get(id: string, projectId: string): Promise<ArchitectureDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(ArchitectureEntity);
    const item = await repository.findOne({ id, project: { id: { $eq: projectId } } });
    if (!item) {
      throw new TsRestException(architectureContract.get, {
        status: 404,

        body: {
          error: "ArchitectureNotFound",
          message: `ArchitectureEntity with id ${id} not found`,
        },
      });
    }
    return await this.architectureMapper.entityToDto(item, projectId, em);
  }
  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<ArchitectureDto>> {
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

    const qb = em.qb(ArchitectureEntity).where({ project: { id: projectId } });
    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await em.populate(items, ["project"]);

    return {
      data: await this.architectureMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(
    parameters: CreateArchitectureDto,
    projectId: string
  ): Promise<ArchitectureDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const project = await repository.findOne({
        id: projectId,
      });
      if (!project) {
        throw new TsRestException(architectureContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.architectureMapper.createDtoToEntity(parameters, projectId, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.architectureMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(architectureContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ArchitectureEntity creation failed",
            },
          })
        : new TsRestException(architectureContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ArchitectureEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateArchitectureDto,
    projectId: string
  ): Promise<ArchitectureDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ArchitectureEntity);
      const existingEntity = await repository.findOne(
        { id, project: { id: projectId } },
        { populate: ["project"] }
      );
      if (!existingEntity) {
        throw new TsRestException(architectureContract.update, {
          status: 404,
          body: {
            error: "ArchitectureNotFound",
            message: `ArchitectureEntity with id ${id} not found`,
          },
        });
      }
      const item = await this.architectureMapper.updateDtoToEntity(id, updateDto, projectId, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.architectureMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(architectureContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ArchitectureEntity update failed",
            },
          })
        : new TsRestException(architectureContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ArchitectureEntity update failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(ArchitectureEntity);
      const entity = await repository.findOne({
        id,
        project: { id: projectId },
      });
      if (!entity) {
        throw new TsRestException(architectureContract.delete, {
          status: 404,
          body: {
            error: "ArchitectureNotFound",
            message: `ArchitectureEntity with id ${id} not found`,
          },
        });
      }
      em.remove(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(architectureContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ArchitectureEntity deletion failed",
            },
          })
        : new TsRestException(architectureContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ArchitectureEntity deletion failed",
            },
          });
    }
  }
}
