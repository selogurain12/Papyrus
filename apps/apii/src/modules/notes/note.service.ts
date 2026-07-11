/* eslint-disable max-lines */
import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import {
  CreateNoteDto,
  FilterDto,
  ListResult,
  noteContract,
  NoteDto,
  UpdateNoteDto,
} from "@papyrus/source";
import { fromDate, now } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { HistoryService } from "../history/history.service";
import { ProjectMapper } from "../projects/projects.mapper";
import { NoteMapper } from "./note.mapper";
import { NoteEntity } from "./note.entity";

@Injectable()
export class NoteService {
  private readonly orm: MikroORM;

  private readonly noteMapper: NoteMapper;

  private readonly projectMapper: ProjectMapper;

  private readonly historyService: HistoryService;

  public constructor(
    orm: MikroORM,
    noteMapper: NoteMapper,
    projectMapper: ProjectMapper,
    historyService: HistoryService
  ) {
    this.orm = orm;
    this.noteMapper = noteMapper;
    this.projectMapper = projectMapper;
    this.historyService = historyService;
  }

  public async get(id: string, projectId: string) {
    const em = this.orm.em.fork();
    const repository = em.getRepository(NoteEntity);
    const item = await repository.findOne({ id: id, project: { id: { $eq: projectId } } });
    if (!item) {
      throw new TsRestException(noteContract.get, {
        status: 404,

        body: {
          error: "NoteNotFound",
          message: `NoteEntity with id ${id} not found`,
        },
      });
    }
    return await this.noteMapper.entityToDto(item, projectId, em);
  }

  public async getAll(filter: FilterDto, projectId: string): Promise<ListResult<NoteDto>> {
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

    const qb = em.qb(NoteEntity).where({ deletedAt: { $eq: null }, project: { id: projectId } });
    const [items, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();

    return {
      data: await this.noteMapper.entitiesToDtos(items, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateNoteDto, projectId: string): Promise<NoteDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const project = await repository.findOne({ id: projectId });
      if (!project) {
        throw new TsRestException(noteContract.create, {
          status: 404,

          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.noteMapper.createDtoToEntity(parameters, projectId, em);
      em.persist(item);
      await this.historyService.create(
        {
          type: "create",
          entity: "note",
          date: now("UTC").toString(),
          title: `Création de la note ${parameters.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.noteMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(noteContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "NoteEntity creation failed",
            },
          })
        : new TsRestException(noteContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "NoteEntity creation failed",
            },
          });
    }
  }

  public async update(id: string, updateDto: UpdateNoteDto, projectId: string): Promise<NoteDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(NoteEntity);
      const existingEntity = await repository.findOne(
        { id: id, project: { id: { $eq: projectId } } },
        { populate: ["project"] }
      );
      if (!existingEntity) {
        throw new TsRestException(noteContract.update, {
          status: 404,

          body: {
            error: "NoteNotFound",
            message: `NoteEntity with id ${id} not found`,
          },
        });
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(noteContract.update, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.noteMapper.updateDtoToEntity(id, updateDto, em);
      em.persist(item);
      await this.historyService.create(
        {
          type: "update",
          entity: "note",
          date: now("UTC").toString(),
          title: `Modification de la note ${existingEntity.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
      await em.populate(item, ["project"]);
      return await this.noteMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(noteContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "NoteEntity update failed",
            },
          })
        : new TsRestException(noteContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "NoteEntity update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(NoteEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!existingEntity) {
        throw new TsRestException(noteContract.softDelete, {
          status: 404,

          body: {
            error: "NoteNotFound",
            message: `NoteEntity with id ${id} not found`,
          },
        });
      }
      const projectRepo = em.getRepository(ProjectEntity);
      const project = await projectRepo.findOne({ id: projectId });

      if (!project) {
        throw new TsRestException(noteContract.delete, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      existingEntity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(existingEntity).flush();
      await this.historyService.create(
        {
          type: "delete",
          entity: "note",
          date: now("UTC").toString(),
          title: `Suppression de la note ${existingEntity.title}`,
          project: await this.projectMapper.entityToDto(project, em),
        },
        projectId
      );
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(noteContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "NoteEntity deletion failed",
            },
          })
        : new TsRestException(noteContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "NoteEntity deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(NoteEntity);
      const existingEntity = await repository.findOne({
        $and: [{ id: id }, { project: { id: { $eq: projectId } } }],
      });
      if (!existingEntity) {
        throw new TsRestException(noteContract.delete, {
          status: 404,

          body: {
            error: "NoteNotFound",
            message: `NoteEntity with id ${id} not found`,
          },
        });
      }
      em.remove(existingEntity);
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(noteContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: error.message || "NoteEntity deletion failed",
            },
          })
        : new TsRestException(noteContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalServerError",
              message: "NoteEntity deletion failed",
            },
          });
    }
  }
}
