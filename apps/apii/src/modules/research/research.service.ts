/* eslint-disable max-lines */
import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import {
  CreateResearchDto,
  FilterResearchDto,
  ListResult,
  researchContract,
  ResearchDto,
  UpdateResearchDto,
} from "@papyrus/source";
import { fromDate, now } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { S3Service } from "../s3/s3.service";
import { HistoryService } from "../history/history.service";
import { ProjectMapper } from "../projects/projects.mapper";
import { ResearchMapper } from "./research.mapper";
import { ResearchEntity } from "./research.entity";

@Injectable()
export class ResearchService {
  private readonly orm: MikroORM;

  private readonly s3Service: S3Service;

  private readonly researchMapper: ResearchMapper;

  private readonly projectMapper: ProjectMapper;

  private readonly historyService: HistoryService;

  // eslint-disable-next-line max-params
  public constructor(
    orm: MikroORM,
    s3Service: S3Service,
    researchMapper: ResearchMapper,
    projectMapper: ProjectMapper,
    historyService: HistoryService
  ) {
    this.orm = orm;
    this.s3Service = s3Service;
    this.researchMapper = researchMapper;
    this.projectMapper = projectMapper;
    this.historyService = historyService;
  }

  public async get(id: string, projectId: string) {
    const em = this.orm.em.fork();
    const repository = em.getRepository(ResearchEntity);
    const item = await repository.findOne({ id: id, project: { id: { $eq: projectId } } });
    if (!item) {
      throw new TsRestException(researchContract.get, {
        status: 404,

        body: {
          error: "ResearchNotFound",
          message: `ResearchEntity with id ${id} not found`,
        },
      });
    }
    return await this.researchMapper.entityToDto(item, projectId, em);
  }

  public async getAll(
    filter: FilterResearchDto,
    projectId: string
  ): Promise<ListResult<ResearchDto>> {
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

    let qb = em.qb(ResearchEntity).where({ project: { id: projectId }, deletedAt: { $eq: null } });
    if (filter.type) {
      qb = qb.andWhere({ type: filter.type });
    }
    if (filter.search !== undefined) {
      qb = qb.andWhere({
        $or: [
          { title: { $ilike: `%${filter.search}%` } },
          { description: { $ilike: `%${filter.search}%` } },
        ],
      });
    }
    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    return {
      data: await this.researchMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateResearchDto, projectId: string): Promise<ResearchDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const project = await repository.findOne({ id: projectId });
      if (!project) {
        throw new TsRestException(researchContract.create, {
          status: 404,

          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }

      const item = await this.researchMapper.createDtoToEntity(parameters, projectId, em);
      em.persist(item);
      await this.historyService.create(
        {
          type: "create",
          entity: "research",
          date: now("UTC").toString(),
          title: `Création de la recherche ${parameters.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.researchMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(researchContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "ResearchEntity creation failed",
            },
          })
        : new TsRestException(researchContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "ResearchEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateResearchDto,
    projectId: string
  ): Promise<ResearchDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ResearchEntity);
      const existingEntity = await repository.findOne(
        { id: id, project: { id: { $eq: projectId } } },
        { populate: ["project"] }
      );
      if (!existingEntity) {
        throw new TsRestException(researchContract.update, {
          status: 404,

          body: {
            error: "ResearchNotFound",
            message: `ResearchEntity with id ${id} not found`,
          },
        });
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(researchContract.update, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.researchMapper.updateDtoToEntity(id, updateDto, em);
      em.persist(item);
      await this.historyService.create(
        {
          type: "update",
          entity: "research",
          date: now("UTC").toString(),
          title: `Modification de la recherche ${existingEntity.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.researchMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(researchContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "ResearchEntity update failed",
            },
          })
        : new TsRestException(researchContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "ResearchEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ResearchEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id: id }, { project: { id: { $eq: projectId } } }, { deletedAt: null }],
      });
      if (!existingEntity) {
        throw new TsRestException(researchContract.delete, {
          status: 404,

          body: {
            error: "ResearchNotFound",
            message: `ResearchEntity with id ${id} not found`,
          },
        });
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(researchContract.delete, {
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
          entity: "research",
          date: now("UTC").toString(),
          title: `Suppression de la recherche ${existingEntity.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(researchContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "ResearchEntity deletion failed",
            },
          })
        : new TsRestException(researchContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "ResearchEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ResearchEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id: id }, { project: { id: { $eq: projectId } } }],
      });
      if (!existingEntity) {
        throw new TsRestException(researchContract.delete, {
          status: 404,

          body: {
            error: "ResearchNotFound",
            message: `ResearchEntity with id ${id} not found`,
          },
        });
      }
      em.remove(existingEntity);
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(researchContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "ResearchEntity deletion failed",
            },
          })
        : new TsRestException(researchContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "ResearchEntity deletion failed",
            },
          });
    }
  }
}
