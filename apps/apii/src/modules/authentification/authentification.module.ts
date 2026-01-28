import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { UserEntity } from "../users/users.entity";
import { AuthGuard } from "./authentification.guard";
import { AuthificationService } from "./authentification.service";
import { AuthificationMapper } from "./authentification.mapper";
import { AuthentificationController } from "./authentification.controller";

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
    }),
  ],
  controllers: [AuthentificationController],
  providers: [AuthGuard, AuthificationService, AuthificationMapper],
  exports: [AuthGuard, JwtModule, AuthificationService, AuthificationMapper],
})
export class AuthentificationModule {}
