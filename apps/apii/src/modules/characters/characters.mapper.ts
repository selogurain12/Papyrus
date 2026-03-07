import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CharacterDto, CreateCharacterDto, UpdateCharacterDto } from "@papyrus/source";
import { parseZonedDateTime } from "@internationalized/date";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { CharacterEntity } from "./characters.entity";

@Injectable()
export class CharacterMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: CharacterEntity,
    projectId: string,
    em: EntityManager
  ): Promise<CharacterDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const projectDto = await this.projectMapper.entityToDto(projectEntity, em);
    return {
      id: entity.id,
      roleStar: entity.roleStar,
      role: entity.role,
      firstName: entity.firstName,
      lastName: entity.lastName,
      nickName: entity.nickName,
      pronouns: entity.pronouns,
      gender: entity.gender,
      nationality: entity.nationality,
      birthDate: entity.birthDate ? entity.birthDate.toString() : null,
      birthPlace: entity.birthPlace,
      residencePlace: entity.residencePlace,
      occupation: entity.occupation,
      age: entity.age,
      height: entity.height,
      weight: entity.weight,
      corpulence: entity.corpulence,
      hairColor: entity.hairColor,
      eyesColor: entity.eyesColor,
      voice: entity.voice,
      outfit: entity.outfit,
      accessory: entity.accessory,
      description: entity.description,
      characterQualities: entity.characterQualities,
      characterFlaws: entity.characterFlaws,
      tastes: entity.tastes,
      tics: entity.tics,
      fears: entity.fears,
      education: entity.education,
      richesses: entity.richesses,
      belief: entity.belief,
      secrets: entity.secrets,
      notablePlaces: entity.notablePlaces,
      typicalExpression: entity.typicalExpression,
      goals: entity.goals,
      past: entity.past,
      present: entity.present,
      future: entity.future,
      notes: entity.notes,
      color: entity.color,
      project: projectDto,
    };
  }

  public async entitiesToDtos(
    entities: CharacterEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<CharacterDto[]> {
    return await Promise.all(
      entities.map(async (entity) => await this.entityToDto(entity, projectId, em))
    );
  }
  public async createDtoToEntity(
    createDto: CreateCharacterDto,
    projectId: string,
    em: EntityManager
  ): Promise<CharacterEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    const result = new CharacterEntity({
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      nickName: createDto.nickName,
      pronouns: createDto.pronouns,
      gender: createDto.gender,
      nationality: createDto.nationality ?? null,
      age: createDto.age,
      birthDate: createDto.birthDate
        ? parseZonedDateTime(createDto.birthDate).set({ second: 0, millisecond: 0 })
        : null,
      birthPlace: createDto.birthPlace,
      residencePlace: createDto.residencePlace,
      occupation: createDto.occupation,
      height: createDto.height,
      weight: createDto.weight,
      corpulence: createDto.corpulence,
      hairColor: createDto.hairColor,
      eyesColor: createDto.eyesColor,
      voice: createDto.voice,
      outfit: createDto.outfit,
      accessory: createDto.accessory,
      description: createDto.description,
      characterQualities: createDto.characterQualities,
      characterFlaws: createDto.characterFlaws,
      tastes: createDto.tastes,
      tics: createDto.tics,
      fears: createDto.fears,
      education: createDto.education,
      richesses: createDto.richesses,
      belief: createDto.belief,
      secrets: createDto.secrets,
      notablePlaces: createDto.notablePlaces,
      typicalExpression: createDto.typicalExpression,
      goals: createDto.goals,
      past: createDto.past,
      present: createDto.present,
      future: createDto.future,
      notes: createDto.notes,
      color: createDto.color,
      project: projectEntity,
      role: createDto.role,
      roleStar: createDto.roleStar,
    });
    return result;
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdateCharacterDto,
    em: EntityManager
  ): Promise<CharacterEntity> {
    const entity = await em.getRepository(CharacterEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`CharacterEntity with id ${id} not found`);
    }
    return em.assign(entity, {
      firstName: updateDto.firstName,
      lastName: updateDto.lastName,
      nickName: updateDto.nickName,
      pronouns: updateDto.pronouns,
      gender: updateDto.gender,
      nationality: updateDto.nationality,
      age: updateDto.age,
      birthDate:
        updateDto.birthDate === null || updateDto.birthDate === undefined
          ? entity.birthDate
          : parseZonedDateTime(updateDto.birthDate).set({ second: 0, millisecond: 0 }),
      birthPlace: updateDto.birthPlace,
      residencePlace: updateDto.residencePlace,
      occupation: updateDto.occupation,
      height: updateDto.height,
      weight: updateDto.weight,
      corpulence: updateDto.corpulence,
      hairColor: updateDto.hairColor,
      eyesColor: updateDto.eyesColor,
      voice: updateDto.voice,
      outfit: updateDto.outfit,
      accessory: updateDto.accessory,
      description: updateDto.description,
      characterQualities: updateDto.characterQualities,
      characterFlaws: updateDto.characterFlaws,
      tastes: updateDto.tastes,
      tics: updateDto.tics,
      fears: updateDto.fears,
      education: updateDto.education,
      richesses: updateDto.richesses,
      belief: updateDto.belief,
      secrets: updateDto.secrets,
      notablePlaces: updateDto.notablePlaces,
      typicalExpression: updateDto.typicalExpression,
      goals: updateDto.goals,
      past: updateDto.past,
      present: updateDto.present,
      future: updateDto.future,
      notes: updateDto.notes,
      color: updateDto.color,
    });
  }
}
