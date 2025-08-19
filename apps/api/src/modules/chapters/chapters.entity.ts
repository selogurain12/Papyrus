import { randomUUID } from "node:crypto";
import { ZonedDateTime } from "@internationalized/date";
import { Entity, ManyToOne, PrimaryKey, Property, type Ref, UuidType } from "@mikro-orm/postgresql";
import { Part } from "src/modules/parts/parts.entity";
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

  @Property({ type: "string", default: "toStart " })
  public status: "toStart" | "inProgress" | "completed";

  @Property({ type: "text", nullable: true })
  public content: string | null = null;

  @Property({ type: "int" })
  public chapterNumber: number;

  @Property({ type: "int", default: 0 })
  public wordCount: number;

  @Property({ type: "int", default: 500 })
  public wordGoal: number;

  @Property({ type: ZonedDateTimeType })
  public createdAt: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;

  @ManyToOne(() => Part, { ref: true })
  public part: Ref<Part>;
}
