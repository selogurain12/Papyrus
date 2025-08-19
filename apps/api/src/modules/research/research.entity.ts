import { randomUUID } from "node:crypto";
import { ZonedDateTime } from "@internationalized/date";
import { Entity, ManyToOne, PrimaryKey, Property, type Ref, UuidType } from "@mikro-orm/postgresql";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { Project } from "../projects/projects.entity";

@Entity()
export class Research {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "text", nullable: true })
  public content: string | null = null;

  @Property({ type: "string" })
  public type: "articles" | "links" | "images" | "videos" | "books";

  @Property({ type: "string", nullable: true })
  public sources: string | null = null;

  @Property({ type: "array", nullable: true })
  public tag: string[] | null = null;

  @Property({ type: "string", nullable: true })
  public note: string | null = null;

  @Property({ type: "string", nullable: true })
  public link: string | null = null;

  @Property({ type: ZonedDateTimeType })
  public createdAt: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;
}
