import { Injectable } from "@nestjs/common";
import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { CreatePlaceDto, PlaceDto, UpdatePlaceDto } from "@papyrus/source";
import { ProjectMapper } from "../projects/projects.mapper";
import { ProjectEntity } from "../projects/projects.entity";
import { PlaceEntity } from "./place.entity";

@Injectable()
export class PlaceMapper {
  private readonly projectMapper: ProjectMapper;

  public constructor(projectMapper: ProjectMapper) {
    this.projectMapper = projectMapper;
  }

  public async entityToDto(
    entity: PlaceEntity,
    projectId: string,
    em: EntityManager
  ): Promise<PlaceDto> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return {
      id: entity.id,
      name: entity.name,
      nickname: entity.nickname,
      type: entity.type,
      localisation: entity.localisation,
      physicalDescription: entity.physicalDescription,
      atmosphere: entity.atmosphere,
      history: entity.history,
      population: entity.population,
      usages: entity.usages,
      language: entity.language,
      government: entity.government,
      ressources: entity.ressources,
      narrativeImportance: entity.narrativeImportance,
      project: await this.projectMapper.entityToDto(projectEntity, em),
    };
  }

  public async entitiesToDtos(
    entities: PlaceEntity[],
    projectId: string,
    em: EntityManager
  ): Promise<PlaceDto[]> {
    return await Promise.all(
      entities.map(async (entity) => this.entityToDto(entity, projectId, em))
    );
  }

  public async createDtoToEntity(
    createDto: CreatePlaceDto,
    projectId: string,
    em: EntityManager
  ): Promise<PlaceEntity> {
    const projectEntity = await em.getRepository(ProjectEntity).findOne({ id: projectId });
    if (!projectEntity) {
      throw new NotFoundError(`ProjectEntity with id ${projectId} not found`);
    }
    return new PlaceEntity({
      name: createDto.name,
      nickname: createDto.nickname,
      type: createDto.type,
      localisation: createDto.localisation,
      physicalDescription: createDto.physicalDescription,
      atmosphere: createDto.atmosphere,
      history: createDto.history,
      population: createDto.population,
      usages: createDto.usages,
      language: createDto.language,
      government: createDto.government,
      ressources: createDto.ressources,
      narrativeImportance: createDto.narrativeImportance,
      project: projectEntity,
    });
  }

  public async updateDtoToEntity(
    id: string,
    updateDto: UpdatePlaceDto,
    em: EntityManager
  ): Promise<PlaceEntity> {
    const entity = await em.getRepository(PlaceEntity).findOne({ id });
    if (!entity) {
      throw new NotFoundError(`PlaceEntity with id ${id} not found`);
    }
    return em.assign(entity, {
      name: updateDto.name,
      nickname: updateDto.nickname,
      type: updateDto.type,
      localisation: updateDto.localisation,
      physicalDescription: updateDto.physicalDescription,
      atmosphere: updateDto.atmosphere,
      history: updateDto.history,
      population: updateDto.population,
      usages: updateDto.usages,
      language: updateDto.language,
      government: updateDto.government,
      ressources: updateDto.ressources,
      narrativeImportance: updateDto.narrativeImportance,
    });
  }
}
