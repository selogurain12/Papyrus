import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { UpdateUserDto, userContract, UserDto } from "@papyrus/source";
import { TsRestException } from "@ts-rest/nest";
import { ProjectEntity } from "../projects/projects.entity";
import { ProjectService } from "../projects/projects.service";
import { UserMapper } from "./users.mapper";
import { UserEntity } from "./users.entity";

@Injectable()
export class UserService {
  private readonly orm: MikroORM;

  private readonly userMapper: UserMapper;

  private readonly projectService: ProjectService;

  public constructor(userMapper: UserMapper, orm: MikroORM, projectService: ProjectService) {
    this.userMapper = userMapper;
    this.orm = orm;
    this.projectService = projectService;
  }
  public async get(id: string): Promise<UserDto> {
    const em = this.orm.em.fork();
    const repository = em.getRepository(UserEntity);
    const item = await repository.findOne({ id });
    if (!item) {
      throw new TsRestException(userContract.get, {
        status: 404,

        body: {
          error: "UserNotFound",
          message: `UserEntity with id ${id} not found`,
        },
      });
    }
    return this.userMapper.entityToDto(item);
  }

  public async update(id: string, updateDto: UpdateUserDto): Promise<UserDto> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(UserEntity);
      const item = await repository.findOne({ id });
      if (!item) {
        throw new TsRestException(userContract.update, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `UserEntity with id ${id} not found`,
          },
        });
      }
      this.userMapper.updateDtoToEntity(item, updateDto, em);
      em.persist(item);
      await em.commit();
      return this.userMapper.entityToDto(item);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(userContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "UserEntity update failed",
            },
          })
        : new TsRestException(userContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "UserEntity update failed",
            },
          });
    }
  }

  public async delete(id: string): Promise<void> {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(UserEntity);
      const item = await repository.findOne({ id });
      if (!item) {
        throw new TsRestException(userContract.delete, {
          status: 404,
          body: {
            error: "UserNotFound",
            message: `UserEntity with id ${id} not found`,
          },
        });
      }
      const projectRepository = em.getRepository(ProjectEntity);
      const projects = await projectRepository.find({ user: item });
      if (projects.length > 0) {
        for (const project of projects) {
          await this.projectService.delete(project.id, item.id);
        }
      }
      em.remove(item);
      await em.commit();
    } catch (error) {
      await em.rollback();
      throw error instanceof Error
        ? new TsRestException(userContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalError",
              message: error.message || "UserEntity deletion failed",
            },
          })
        : new TsRestException(userContract.delete, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              error: "InternalError",
              message: "UserEntity deletion failed",
            },
          });
    }
  }
}
