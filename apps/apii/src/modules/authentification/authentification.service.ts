import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { EntityManager } from "@mikro-orm/postgresql";
import { TsRestException } from "@ts-rest/nest";
import { authContract, LoginDto, RegisterDto } from "@papyrus/source";
import { UserEntity } from "../users/users.entity";
import { AuthificationMapper } from "./authentification.mapper";

@Injectable()
export class AuthificationService {
  public readonly em: EntityManager;

  private readonly mapper: AuthificationMapper;
  constructor(em: EntityManager, configService: ConfigService, mapper: AuthificationMapper) {
    this.em = em;
    this.mapper = mapper;
  }

  async register(createUserDto: RegisterDto) {
    const em = this.em.fork();
    await em.begin();

    try {
      const { password, ...rest } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.mapper.createDtoToEntity({
        ...rest,
        password: hashedPassword,
      });

      await em.persist(newUser).flush();
      await em.commit();

      const token = this.generateJwtToken(
        newUser.id,
        newUser.email,
        `${newUser.firstName} ${newUser.lastName}`
      );

      return { token, user: this.mapper.entityToDto(newUser) };
    } catch (error: unknown) {
      await em.rollback();

      if (error instanceof Error) {
        throw new TsRestException(authContract.register, {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            error: "InternalError",
            message: error.message,
          },
        });
      }

      throw new TsRestException(authContract.register, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        body: {
          error: "InternalError",
          message: "Account creation failed",
        },
      });
    }
  }

  async findUserById(id: string) {
    const em = this.em.fork();
    const repository = em.getRepository(UserEntity);
    const entity = await repository.findOne({ id });
    if (!entity) {
      throw new TsRestException(authContract.login, {
        status: HttpStatus.NOT_FOUND,
        body: {
          error: "userNotFound",
          message: `UserEntity with ${id} not found`,
        },
      });
    }
    return this.mapper.entityToDto(entity);
  }

  async login(loginUserDto: LoginDto) {
    const em = this.em.fork();
    const repository = em.getRepository(UserEntity);
    const { email, password } = loginUserDto;
    const user = await repository.findOne({ email });

    if (!user) {
      throw new TsRestException(authContract.login, {
        status: HttpStatus.NOT_FOUND,
        body: {
          error: "userNotFound",
          message: `UserEntity with email ${email} not found`,
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new TsRestException(authContract.login, {
        status: HttpStatus.UNAUTHORIZED,
        body: {
          error: "unauthorized",
          message: "Password not valid",
        },
      });
    }

    const token = this.generateJwtToken(user.id, email, `${user.firstName} ${user.lastName}`);

    return { token, user };
  }

  private generateJwtToken(userId: string, email: string, name: string): string {
    const payload = { sub: userId, email, name };
    const secret = process.env.SECRET;

    if (!secret) {
      throw new Error("JWT Secret is not defined");
    }

    return jwt.sign(payload, secret);
  }
}
