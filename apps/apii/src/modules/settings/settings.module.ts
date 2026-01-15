import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { SettingEntity } from "./settings.entity";
import { SettingController } from "./settings.controller";
import { SettingService } from "./settings.service";
import { SettingMapper } from "./settings.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([SettingEntity])],
  controllers: [SettingController],
  providers: [SettingService, SettingMapper],
  exports: [SettingService, SettingMapper],
})
export class SettingModule {}
