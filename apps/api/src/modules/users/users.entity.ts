import { randomUUID } from "node:crypto";
import { ZonedDateTime } from "@internationalized/date";
import { Entity, PrimaryKey, Property, UuidType } from "@mikro-orm/postgresql";
import { ZonedDateTimeType } from "src/utils/zoned-date-time";

@Entity()
export class User {
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

  @Property({ type: "string" })
  public password: string;

  @Property({ type: ZonedDateTimeType })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @Property({ type: "array", nullable: true })
  public projects: string[] | null;
}
