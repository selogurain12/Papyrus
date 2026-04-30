import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import { structureContract, UpdateStructureDto } from "@papyrus/source";
import { StructureMapper } from "./structure.mapper";
import { StructureEntity } from "./structure.entity";

@Injectable()
export class StructureService {
  private readonly orm: MikroORM;
  private readonly structuresMapper: StructureMapper;

  constructor(structuresMapper: StructureMapper, orm: MikroORM) {
    this.structuresMapper = structuresMapper;
    this.orm = orm;
  }

  public async get(id: string) {
    const em = this.orm.em.fork();
    const repository = em.getRepository(StructureEntity);
    const item = await repository.findOne({ id });
    if (!item) {
      throw new TsRestException(structureContract.get, {
        status: 404,

        body: {
          error: "StructureNotFound",
          message: `StructureEntity with id ${id} not found`,
        },
      });
    }
    return this.structuresMapper.entityToDto(item);
  }

  public async update(id: string, updateDto: UpdateStructureDto) {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(StructureEntity);
      const item = await repository.findOne({ id });
      if (!item) {
        throw new TsRestException(structureContract.update, {
          status: 404,

          body: {
            error: "StructureNotFound",
            message: `StructureEntity with id ${id} not found`,
          },
        });
      }
      this.structuresMapper.updateDtoToEntity(item, updateDto, em);
      await em.commit();
      return this.structuresMapper.entityToDto(item);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(structureContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "StructureEntity update failed",
            },
          })
        : new TsRestException(structureContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "StructureEntity update failed",
            },
          });
    }
  }
}
