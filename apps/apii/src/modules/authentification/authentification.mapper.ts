import { Injectable } from "@nestjs/common";
import { RegisterDto, UserDto } from "@papyrus/source";
import { UserEntity } from "../users/users.entity";

@Injectable()
export class AuthificationMapper {
  public entityToDto(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
    };
  }

  public entitiesToDtos(entities: UserEntity[]): UserDto[] {
    return entities.map((entity) => this.entityToDto(entity));
  }

  public createDtoToEntity(createDto: RegisterDto): UserEntity {
    return new UserEntity({
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      email: createDto.email,
      password: createDto.password,
    });
  }
}
