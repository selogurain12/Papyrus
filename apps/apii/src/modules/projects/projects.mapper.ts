import { Injectable } from "@nestjs/common";
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from "@papyrus/source";
import { parseZonedDateTime } from "@internationalized/date";
import { NotFoundError, type EntityManager } from "@mikro-orm/postgresql";
import { UserEntity } from "../users/users.entity";
import { UserMapper } from "../users/users.mapper";
import { SettingEntity } from "../settings/settings.entity";
import { SettingMapper } from "../settings/settings.mapper";
import { ProjectEntity } from "./projects.entity";

@Injectable()
export class ProjectMapper {
  private readonly userMapper: UserMapper;

  private readonly settingsMapper: SettingMapper;

  public constructor(userMapper: UserMapper, settingsMapper: SettingMapper) {
    this.userMapper = userMapper;
    this.settingsMapper = settingsMapper;
  }

  public async entityToDto(entity: ProjectEntity, em: EntityManager): Promise<ProjectDto> {
    const userEntity = await em.getRepository(UserEntity).findOne({ id: entity.user.id });
    if (!userEntity) {
      throw new NotFoundError(`UserEntity with id ${entity.user.id} not found`);
    }
    const userDto = this.userMapper.entityToDto(userEntity);

    const settingEntity = await em.getRepository(SettingEntity).findOne({ id: entity.settings.id });
    if (!settingEntity) {
      throw new NotFoundError(`SettingEntity with id ${entity.settings.id} not found`);
    }
    const settingsDto = this.settingsMapper.entityToDto(settingEntity);

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      genre: entity.genre,
      targetWordCount: entity.targetWordCount,
      currentWordCount: entity.currentWordCount,
      status: entity.status,
      author: entity.author,
      language: entity.language,
      deadline: entity.deadline ? entity.deadline.toString() : null,
      settings: settingsDto,
      user: userDto,
    };
  }

  public async entitiesToDtos(entities: ProjectEntity[], em: EntityManager): Promise<ProjectDto[]> {
    return await Promise.all(entities.map(async (entity) => await this.entityToDto(entity, em)));
  }

  public async createDtoToEntity(
    createDto: CreateProjectDto,
    userId: string,
    em: EntityManager
  ): Promise<ProjectEntity> {
    const userEntity = await em.getRepository(UserEntity).findOne({ id: userId });
    if (!userEntity) {
      throw new NotFoundError(`UserEntity with id ${userId} not found`);
    }
    return new ProjectEntity({
      ...createDto,
      targetWordCount: createDto.targetWordCount ?? 10000,
      currentWordCount: createDto.currentWordCount ?? 0,
      status: createDto.status ?? "planning",
      deadline: createDto.deadline
        ? parseZonedDateTime(createDto.deadline).set({ second: 0, millisecond: 0 })
        : null,
      settings: this.settingsMapper.createDtoToEntity(),
      user: userEntity,
    });
  }

  public updateDtoToEntity(
    entity: ProjectEntity,
    updateDto: UpdateProjectDto,
    em: EntityManager
  ): ProjectEntity {
    const {
      title,
      description,
      genre,
      targetWordCount,
      currentWordCount,
      status,
      language,
      deadline,
    } = updateDto;

    return em.assign(entity, {
      title,
      description,
      genre,
      targetWordCount,
      currentWordCount,
      status,
      language,
      deadline:
        deadline === null || deadline === undefined
          ? deadline
          : parseZonedDateTime(deadline).set({
              second: 0,
              millisecond: 0,
            }),
    });
  }
}
