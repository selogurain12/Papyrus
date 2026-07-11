/* eslint-disable max-lines */
import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import {
  characterContract,
  CharacterDto,
  CreateCharacterDto,
  FilterCharacterDto,
  ListResult,
  UpdateCharacterDto,
} from "@papyrus/source";
import { fromDate, now } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { ProjectMapper } from "../projects/projects.mapper";
import { HistoryService } from "../history/history.service";
import { CharacterMapper } from "./characters.mapper";
import { CharacterEntity } from "./characters.entity";

@Injectable()
export class CharacterService {
  private readonly orm: MikroORM;

  private readonly characterMapper: CharacterMapper;

  private readonly projectMapper: ProjectMapper;

  private readonly historyService: HistoryService;

  public constructor(
    orm: MikroORM,
    characterMapper: CharacterMapper,
    projectMapper: ProjectMapper,
    historyService: HistoryService
  ) {
    this.orm = orm;
    this.characterMapper = characterMapper;
    this.projectMapper = projectMapper;
    this.historyService = historyService;
  }

  public async get(id: string, projectId: string): Promise<CharacterDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(CharacterEntity);
    const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
    if (!item) {
      throw new TsRestException(characterContract.get, {
        status: 404,

        body: {
          error: "CharacterNotFound",
          message: `CharacterEntity with id ${id} not found`,
        },
      });
    }
    return await this.characterMapper.entityToDto(item, projectId, em);
  }

  // eslint-disable-next-line complexity
  public async getAll(
    filter: FilterCharacterDto,
    projectId: string
  ): Promise<ListResult<CharacterDto>> {
    const em = this.orm.em.fork();
    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    const disablePagination = filter.disablePagination ?? false;
    if (!disablePagination) {
      limit = filter.itemsPerPage ?? 20;

      offset = ((filter.page ?? 1) - 1) * limit;
    }
    const orderBy = filter.orderBy ?? {
      firstName: "DESC",
    };
    let qb = em.qb(CharacterEntity).where({ deletedAt: { $eq: null }, project: { id: projectId } });
    if (filter.role !== undefined && filter.role.length > 0) {
      qb = qb.andWhere({ role: { $in: filter.role } });
    }
    if (filter.minAge !== undefined) {
      qb = qb.andWhere({ age: { $gte: fromDate(new Date(filter.minAge), "UTC") } });
    }
    if (filter.maxAge !== undefined) {
      qb = qb.andWhere({ age: { $lte: fromDate(new Date(filter.maxAge), "UTC") } });
    }
    if (filter.objects !== undefined && filter.objects.length > 0) {
      qb = qb.andWhere({ objects: { id: { $in: filter.objects } } });
    }
    if (filter.events !== undefined && filter.events.length > 0) {
      qb = qb.andWhere({ events: { id: { $in: filter.events } } });
    }
    if (filter.search !== undefined) {
      qb = qb.andWhere({
        $or: [
          { firstName: { $ilike: `%${filter.search}%` } },
          { lastName: { $ilike: `%${filter.search}%` } },
          { description: { $ilike: `%${filter.search}%` } },
        ],
      });
    }

    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    await em.populate(items, ["project"]);

    return {
      data: await this.characterMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateCharacterDto, projectId: string): Promise<CharacterDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingProject = await repository.findOne({
        id: projectId,
      });
      if (!existingProject) {
        throw new TsRestException(characterContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.characterMapper.createDtoToEntity(parameters, projectId, em);
      em.persist(item);
      await this.historyService.create(
        {
          type: "create",
          entity: "character",
          date: now("UTC").toString(),
          title: `Création du personnage ${parameters.firstName} ${parameters.lastName}`,
          project: await this.projectMapper.entityToDto(existingProject, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.characterMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(characterContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "CharacterEntity creation failed",
            },
          })
        : new TsRestException(characterContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "CharacterEntity creation failed",
            },
          });
    }
  }

  public async update(
    id: string,
    updateDto: UpdateCharacterDto,
    projectId: string
  ): Promise<CharacterDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(CharacterEntity);
      const item = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
      if (!item) {
        throw new TsRestException(characterContract.update, {
          status: 404,

          body: {
            error: "CharacterNotFound",
            message: `CharacterEntity with id ${id} not found`,
          },
        });
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(characterContract.update, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }

      const updatedItem = await this.characterMapper.updateDtoToEntity(id, updateDto, em);
      await em.persist(updatedItem).flush();
      await this.historyService.create(
        {
          type: "update",
          entity: "character",
          date: now("UTC").toString(),
          title: `Modification du personnage ${item.firstName} ${item.lastName}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(updatedItem, ["project"]);
      return await this.characterMapper.entityToDto(updatedItem, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(characterContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "CharacterEntity update failed",
            },
          })
        : new TsRestException(characterContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "CharacterEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(CharacterEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(characterContract.delete, {
          status: 404,
          body: {
            error: "CharacterNotFound",
            message: `CharacterEntity with id ${id} not found`,
          },
        });
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(characterContract.delete, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }

      entity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(entity).flush();
      await this.historyService.create(
        {
          type: "delete",
          entity: "character",
          date: now("UTC").toString(),
          title: `Suppression du personnage ${entity.firstName} ${entity.lastName}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(characterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "CharacterEntity deletion failed",
            },
          })
        : new TsRestException(characterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "CharacterEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(CharacterEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(characterContract.delete, {
          status: 404,
          body: {
            error: "CharacterNotFound",
            message: `CharacterEntity with id ${id} not found`,
          },
        });
      }
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(characterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "CharacterEntity deletion failed",
            },
          })
        : new TsRestException(characterContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "CharacterEntity deletion failed",
            },
          });
    }
  }
}
