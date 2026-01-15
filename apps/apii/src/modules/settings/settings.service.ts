import { MikroORM } from "@mikro-orm/postgresql";
import { HttpStatus, Injectable } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import { settingContract, UpdatedSettingDto } from "@papyrus/source";
import { SettingMapper } from "./settings.mapper";
import { SettingEntity } from "./settings.entity";

@Injectable()
export class SettingService {
  private readonly orm: MikroORM;
  private readonly settingsMapper: SettingMapper;

  constructor(settingsMapper: SettingMapper, orm: MikroORM) {
    this.settingsMapper = settingsMapper;
    this.orm = orm;
  }

  public async get(id: string) {
    const em = this.orm.em.fork();
    const repository = em.getRepository(SettingEntity);
    const item = await repository.findOne({ id });
    if (!item) {
      throw new TsRestException(settingContract.get, {
        status: 404,

        body: {
          error: "SettingNotFound",
          message: `SettingEntity with id ${id} not found`,
        },
      });
    }
    return this.settingsMapper.entityToDto(item);
  }

  public async update(id: string, updateDto: UpdatedSettingDto) {
    const em = this.orm.em.fork();
    await em.begin();
    try {
      const repository = em.getRepository(SettingEntity);
      const item = await repository.findOne({ id });
      if (!item) {
        throw new TsRestException(settingContract.update, {
          status: 404,

          body: {
            error: "SettingNotFound",
            message: `SettingEntity with id ${id} not found`,
          },
        });
      }
      this.settingsMapper.updateDtoToEntity(item, updateDto, em);
      await em.commit();
      return this.settingsMapper.entityToDto(item);
    } catch (error) {
      await em.rollback();

      throw error instanceof Error
        ? new TsRestException(settingContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: error.message || "SettingEntity update failed",
            },
          })
        : new TsRestException(settingContract.update, {
            status: HttpStatus.INTERNAL_SERVER_ERROR,

            body: {
              error: "InternalError",
              message: "SettingEntity update failed",
            },
          });
    }
  }
}
