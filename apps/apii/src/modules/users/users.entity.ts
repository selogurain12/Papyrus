import { randomUUID } from "node:crypto";
import { now, ZonedDateTime } from "@internationalized/date";
import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  UuidType,
} from "@mikro-orm/postgresql";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class UserEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public firstName: string;

  @Property({ type: "string" })
  public lastName: string;

  @Property({ type: "string" })
  public email: string;

  @Property({ type: "string", hidden: true })
  public password: string;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, onUpdate: () => now("UTC"), nullable: true })
  public updatedAt!: ZonedDateTime | null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt!: ZonedDateTime | null;

  @OneToMany(() => ProjectEntity, (project) => project.user, { nullable: true })
  public projects: Collection<ProjectEntity> | null = null;

  public constructor(parameters: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    this.firstName = parameters.firstName;
    this.lastName = parameters.lastName;
    this.email = parameters.email;
    this.password = parameters.password;
  }
}
