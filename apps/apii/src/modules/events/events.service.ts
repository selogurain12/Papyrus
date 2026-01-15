import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateEventDto,
  eventContract,
  EventDto,
  FilterEventDto,
  ListResult,
  UpdateEventDto,
} from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { fromDate } from "@internationalized/date";
import { ProjectEntity } from "../projects/projects.entity";
import { EventMapper } from "./events.mapper";
import { EventEntity } from "./events.entity";

@Injectable()
export class EventService {
  private readonly orm: MikroORM;

  private readonly eventsMapper: EventMapper;

  public constructor(orm: MikroORM, eventsMapper: EventMapper) {
    this.orm = orm;
    this.eventsMapper = eventsMapper;
  }

  public async get(id: string, projectId: string): Promise<EventDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(EventEntity);
    const entity = await repository.findOne({ id, project: { id: projectId }, deletedAt: null });
    if (!entity) {
      throw new TsRestException(eventContract.get, {
        status: 404,

        body: {
          error: "EventNotFound",
          message: `Event with id ${id} not found`,
        },
      });
    }
    return this.eventsMapper.entityToDto(entity, projectId, em);
  }

  // eslint-disable-next-line complexity
  public async getAll(filter: FilterEventDto, projectId: string): Promise<ListResult<EventDto>> {
    const em = this.orm.em.fork();
    let limit: number | undefined = undefined;
    let offset: number | undefined = undefined;
    const disablePagination = filter.disablePagination ?? false;
    if (!disablePagination) {
      limit = filter.itemsPerPage ?? 20;

      offset = ((filter.page ?? 1) - 1) * limit;
    }
    const orderBy = filter.orderBy ?? {
      eventDate: "DESC",
    };
    let qb = em.qb(EventEntity).where({ deletedAt: { $eq: null }, project: { id: projectId } });
    if (filter.importance !== undefined && filter.importance.length > 0) {
      qb = qb.andWhere({ importance: { $in: filter.importance } });
    }
    if (filter.minDate) {
      qb = qb.andWhere({ eventDate: { $gte: filter.minDate } });
    }
    if (filter.maxDate) {
      qb = qb.andWhere({ eventDate: { $lte: filter.maxDate } });
    }
    if (filter.search !== undefined) {
      qb = qb.andWhere({ title: { $like: `%${filter.search}%` } });
    }
    const [entities, total] = await qb
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)
      .getResultAndCount();
    return {
      data: await this.eventsMapper.entitiesToDtos(entities, projectId, em),
      total,
    };
  }

  public async create(parameters: CreateEventDto, projectId: string): Promise<EventDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(ProjectEntity);
      const existingProject = await repository.findOne({ id: projectId });
      if (!existingProject) {
        throw new TsRestException(eventContract.create, {
          status: 404,
          body: {
            error: "ProjectNotFound",
            message: `ProjectEntity with id ${projectId} not found`,
          },
        });
      }
      const item = await this.eventsMapper.createDtoToEntity(parameters, projectId, em);
      await em.persist(item).flush();
      await em.commit();
      return await this.eventsMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(eventContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Event creation failed",
            },
          })
        : new TsRestException(eventContract.create, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Event creation failed",
            },
          });
    }
  }

  public async update(id: string, updateDto: UpdateEventDto, projectId: string): Promise<EventDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(EventEntity);
      const existingEntity = await repository.findOne({
        id,
        project: { id: projectId },
        deletedAt: null,
      });
      if (!existingEntity) {
        throw new TsRestException(eventContract.update, {
          status: 404,
          body: {
            error: "EventNotFound",
            message: `Event with id ${id} not found`,
          },
        });
      }
      const item = await this.eventsMapper.updateDtoToEntity(id, updateDto, em);
      await em.persist(item).flush();
      await em.commit();
      return await this.eventsMapper.entityToDto(item, projectId, em);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(eventContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Event update failed",
            },
          })
        : new TsRestException(eventContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Event update failed",
            },
          });
    }
  }

  public async softDelete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(EventEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { deletedAt: { $eq: null }, project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(eventContract.delete, {
          status: 404,
          body: {
            error: "EventNotFound",
            message: `Event with id ${id} not found`,
          },
        });
      }
      entity.deletedAt = fromDate(new Date(), "UTC");
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(eventContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Event deletion failed",
            },
          })
        : new TsRestException(eventContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Event deletion failed",
            },
          });
    }
  }

  public async delete(id: string, projectId: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();

    try {
      const repository = em.getRepository(EventEntity);
      const entity = await repository.findOne({
        $and: [{ id }, { project: { id: projectId } }],
      });
      if (!entity) {
        throw new TsRestException(eventContract.delete, {
          status: 404,
          body: {
            error: "EventNotFound",
            message: `Event with id ${id} not found`,
          },
        });
      }
      await em.persist(entity).flush();
      await em.commit();
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(eventContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "Event deletion failed",
            },
          })
        : new TsRestException(eventContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "Event deletion failed",
            },
          });
    }
  }
}
