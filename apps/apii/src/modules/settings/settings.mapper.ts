import { Injectable } from "@nestjs/common";
import { SettingDto, UpdatedSettingDto } from "@papyrus/source";
import { EntityManager } from "@mikro-orm/postgresql";
import { SettingEntity } from "./settings.entity";

@Injectable()
export class SettingMapper {
  public entityToDto(entity: SettingEntity): SettingDto {
    return {
      id: entity.id,
      language: entity.language,
      autoSave: entity.autoSave,
      autoSaveInterval: entity.autoSaveInterval,
      dailyWordCountGoal: entity.dailyWordCountGoal,
      theme: entity.theme,
      fontSize: entity.fontSize,
      fontFamily: entity.fontFamily,
      enableNotifications: entity.enableNotifications,
      dailyReminder: entity.dailyReminder,
      goalReminder: entity.goalReminder,
      backupReminder: entity.backupReminder,
      enableAutoBackup: entity.enableAutoBackup,
      backupFrequency: entity.backupFrequency,
      exportFormat: entity.exportFormat,
      showStatistics: entity.showStatistics,
      trackWritingTime: entity.trackWritingTime,
      saveHistory: entity.saveHistory,
    };
  }

  public createDtoToEntity(): SettingEntity {
    return new SettingEntity();
  }

  public updateDtoToEntity(
    entity: SettingEntity,
    updateDto: UpdatedSettingDto,
    em: EntityManager
  ): SettingEntity {
    const {
      language,
      autoSave,
      autoSaveInterval,
      dailyWordCountGoal,
      theme,
      fontSize,
      fontFamily,
      enableNotifications,
      dailyReminder,
      goalReminder,
      backupReminder,
      enableAutoBackup,
      backupFrequency,
      exportFormat,
      showStatistics,
      trackWritingTime,
      saveHistory,
    } = updateDto;
    return em.assign(entity, {
      language,
      autoSave,
      autoSaveInterval,
      dailyWordCountGoal,
      theme,
      fontSize,
      fontFamily,
      enableNotifications,
      dailyReminder,
      goalReminder,
      backupReminder,
      enableAutoBackup,
      backupFrequency,
      exportFormat,
      showStatistics,
      trackWritingTime,
      saveHistory,
    });
  }
}
