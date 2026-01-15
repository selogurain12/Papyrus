import { MikroOrmModule } from "@mikro-orm/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { ProjectModule } from "../projects/projects.module";
import { UserEntity } from "./users.entity";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { UserMapper } from "./users.mapper";

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), forwardRef(() => ProjectModule)],
  controllers: [UserController],
  providers: [UserService, UserMapper],
  exports: [UserService, UserMapper],
})
export class UsersModule {}
