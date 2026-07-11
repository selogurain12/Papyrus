/* eslint-disable max-lines */
import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import {
  CreatePartDto,
  FilterDto,
  ListResult,
  partContract,
  PartDto,
  UpdatePartDto,
} from "@papyrus/source";
import { fromDate, now } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { ChapterService } from "../chapters/chapters.service";
import { HistoryService } from "../history/history.service";
import { ProjectMapper } from "../projects/projects.mapper";
import { PartMapper } from "./part.mapper";
import { PartEntity } from "./part.entity";

@Injectable()
export class PartService {
  private readonly orm: MikroORM;

  private readonly partMapper: PartMapper;

  private readonly chapterService: ChapterService;

  private readonly projectMapper: ProjectMapper;

  private readonly historyService: HistoryService;

  // eslint-disable-next-line max-params
  public constructor(
    orm: MikroORM,
    partMapper: PartMapper,
    chapterService: ChapterService,
    projectMapper: ProjectMapper,
    historyService: HistoryService
  ) {
    this.orm = orm;
    this.partMapper = partMapper;
    this.chapterService = chapterService;
    this.projectMapper = projectMapper;
    this.historyService = historyService;
  }

  public async get(id: string, projectId: string) {
    const em = this.orm.em.fork();
    const repository = em.getRepository(PartEntity);
    const item = await repository.findOne({ id: id, project: { id: { $eq: projectId } } });
    if (!item) {
      throw new TsRestException(partContract.get, {
        status: 404,

        body: {
          error: "PartNotFound",
          message: `PartEntity with id ${id} not found`,
        },
      });
    }
    return await this.partMapper.entityToDto(item, projectId, em);
  }

  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<PartDto>> {
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

    const qb = em.qb(PartEntity).where({ deletedAt: { $eq: null }, project: { id: projectId } });
    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    return {
      data: await this.partMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreatePartDto, projectId: string): Promise<PartDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const project = await repository.findOne({ id: projectId });
      if (!project) {
        throw new TsRestException(partContract.create, {
          status: 404,

          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.partMapper.createDtoToEntity(parameters, projectId, em);
      await em.persist(item).flush();
      await this.historyService.create(
        {
          type: "create",
          entity: "part",
          date: now("UTC").toString(),
          title: `Création de la partie ${parameters.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.partMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(partContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PartEntity creation failed",
            },
          })
        : new TsRestException(partContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PartEntity creation failed",
            },
          });
    }
  }

  public async update(id: string, updateDto: UpdatePartDto, projectId: string): Promise<PartDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(PartEntity);
      const existingEntity = await repository.findOne(
        { id: id, project: { id: { $eq: projectId } } },
        { populate: ["project"] }
      );
      if (!existingEntity) {
        throw new TsRestException(partContract.update, {
          status: 404,

          body: {
            error: "PartNotFound",
            message: `PartEntity with id ${id} not found`,
          },
        });
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(partContract.update, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.partMapper.updateDtoToEntity(id, updateDto, em);
      em.persist(item);
      await this.historyService.create(
        {
          type: "update",
          entity: "part",
          date: now("UTC").toString(),
          title: `Modification de la partie ${existingEntity.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.partMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(partContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PartEntity update failed",
            },
          })
        : new TsRestException(partContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PartEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(PartEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id: id }, { project: { id: { $eq: projectId } } }, { deletedAt: null }],
      });
      if (!existingEntity) {
        throw new TsRestException(partContract.delete, {
          status: 404,

          body: {
            error: "PartNotFound",
            message: `PartEntity with id ${id} not found`,
          },
        });
      }

      const chapters = await this.chapterService.getByPart(id, projectId);
      for (const chapter of chapters.data) {
        await this.chapterService.softDelete(chapter.id, projectId);
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(partContract.delete, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      existingEntity.deletedAt = fromDate(new Date(), "UTC");
      em.persist(existingEntity);
      await this.historyService.create(
        {
          type: "delete",
          entity: "part",
          date: now("UTC").toString(),
          title: `Suppression de la partie ${existingEntity.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(partContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PartEntity deletion failed",
            },
          })
        : new TsRestException(partContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PartEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(PartEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id: id }, { project: { id: { $eq: projectId } } }],
      });
      if (!existingEntity) {
        throw new TsRestException(partContract.delete, {
          status: 404,

          body: {
            error: "PartNotFound",
            message: `PartEntity with id ${id} not found`,
          },
        });
      }
      em.remove(existingEntity);
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(partContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "PartEntity deletion failed",
            },
          })
        : new TsRestException(partContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "PartEntity deletion failed",
            },
          });
    }
  }
}
