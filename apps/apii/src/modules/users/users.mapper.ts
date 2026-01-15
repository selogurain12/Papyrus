import { Injectable } from "@nestjs/common";
import { UpdateUserDto, UserDto } from "@papyrus/source";
import { EntityManager } from "@mikro-orm/postgresql";
import { UserEntity } from "./users.entity";

@Injectable()
export class UserMapper {
  public entityToDto(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
    };
  }

  public updateDtoToEntity(
    entity: UserEntity,
    updateDto: UpdateUserDto,
    em: EntityManager
  ): UserEntity {
    const { firstName, lastName, email, password } = updateDto;

    return em.assign(entity, {
      firstName,
      lastName,
      email,
      password,
    });
  }
}
