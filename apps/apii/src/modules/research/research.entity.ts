import { randomUUID } from "node:crypto";
import { ZonedDateTime } from "@internationalized/date";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class ResearchEntity {
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
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  public constructor(parameters: {
    title: string;
    type: "articles" | "links" | "images" | "videos" | "books";
    sources: string | null;
    tag: string[] | null;
    note: string | null;
    link: string | null;
    project: ProjectEntity;
  }) {
    this.title = parameters.title;
    this.type = parameters.type;
    this.sources = parameters.sources;
    this.tag = parameters.tag;
    this.note = parameters.note;
    this.link = parameters.link;
    this.project = ref(parameters.project);
  }
}
