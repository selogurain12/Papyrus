import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  chapterContract,
  ChapterDto,
  CreateChapterDto,
  FilterDto,
  ListResult,
  UpdateChapterDto,
} from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { fromDate } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { ChapterMapper } from "./chapters.mapper";
import { ChapterEntity } from "./chapters.entity";

@Injectable()
export class ChapterService {
  private readonly orm: MikroORM;

  private readonly chapterMapper: ChapterMapper;

  public constructor(orm: MikroORM, chapterMapper: ChapterMapper) {
    this.orm = orm;
    this.chapterMapper = chapterMapper;
  }

  public async get(id: string, projectId: string): Promise<ChapterDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(ChapterEntity);
    const item = await repository.findOne({ id, project: { id: { $eq: projectId } } });
    if (!item) {
      throw new TsRestException(chapterContract.get, {
        status: 404,

        body: {
          error: "ChapterNotFound",
          message: `ChapterEntity with id ${id} not found`,
        },
      });
    }
    return await this.chapterMapper.entityToDto(item, projectId, em);
  }
  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<ChapterDto>> {
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

    const qb = em.qb(ChapterEntity).where({ project: { id: projectId } });
    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await em.populate(items, ["project"]);

    return {
      data: await this.chapterMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateChapterDto, projectId: string): Promise<ChapterDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const project = await repository.findOne({
        id: projectId,
      });
      if (!project) {
        throw new TsRestException(chapterContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.chapterMapper.createDtoToEntity(parameters, projectId, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.chapterMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(chapterContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ChapterEntity creation failed",
            },
          })
        : new TsRestException(chapterContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ChapterEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateChapterDto,
    projectId: string
  ): Promise<ChapterDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ChapterEntity);
      const existingEntity = await repository.findOne(
        { id, project: { id: projectId } },
        { populate: ["project"] }
      );
      if (!existingEntity) {
        throw new TsRestException(chapterContract.update, {
          status: 404,
          body: {
            error: "ChapterNotFound",
            message: `ChapterEntity with id ${id} not found`,
          },
        });
      }
      const item = await this.chapterMapper.updateDtoToEntity(id, updateDto, em);
      em.persist(item);
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.chapterMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(chapterContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ChapterEntity update failed",
            },
          })
        : new TsRestException(chapterContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ChapterEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(ChapterEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(chapterContract.delete, {
          status: 404,
          body: {
            error: "ChapterNotFound",
            message: `ChapterEntity with id ${id} not found`,
          },
        });
      }
      entity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(chapterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ChapterEntity deletion failed",
            },
          })
        : new TsRestException(chapterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ChapterEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(ChapterEntity);
      const entity = await repository.findOne({
        id,
        project: { id: projectId },
      });
      if (!entity) {
        throw new TsRestException(chapterContract.delete, {
          status: 404,
          body: {
            error: "ChapterNotFound",
            message: `ChapterEntity with id ${id} not found`,
          },
        });
      }
      em.remove(entity);
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(chapterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "ChapterEntity deletion failed",
            },
          })
        : new TsRestException(chapterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "ChapterEntity deletion failed",
            },
          });
    }
  }
}
