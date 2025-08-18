import { ZonedDateTime } from "@internationalized/date";
import { Entity, ManyToOne, PrimaryKey, Property, type Ref, UuidType } from "@mikro-orm/postgresql";
import { randomUUID } from "node:crypto";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { Project } from "../projects/projects.entity";

@Entity()
export class Chapter {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "text", nullable: true })
  public content: string | null = null;

  @Property({ type: "int" })
  public order: number;

  @Property({ type: "int", default: 0 })
  public wordCount: number;

  @Property({ type: ZonedDateTimeType })
  public createdAt: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;
}
