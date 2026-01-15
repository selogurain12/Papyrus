import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { SettingModule } from "../settings/settings.module";
import { UsersModule } from "../users/users.module";
import { ProjectController } from "./projects.controller";
import { ProjectEntity } from "./projects.entity";
import { ProjectMapper } from "./projects.mapper";
import { ProjectService } from "./projects.service";

@Module({
  imports: [
    MikroOrmModule.forFeature([ProjectEntity]),
    SettingModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectMapper],
  exports: [ProjectService, ProjectMapper],
})
export class ProjectModule {}
