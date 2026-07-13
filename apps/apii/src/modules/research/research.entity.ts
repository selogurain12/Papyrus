import { randomUUID } from "node:crypto";
import { now, ZonedDateTime } from "@internationalized/date";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { ResearchType } from "@papyrus/source";
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
  public type: ResearchType;

  @Property({ type: "string", nullable: true })
  public sources?: string | null = null;

  @Property({ type: "array", nullable: true })
  public tag: string[] | null = null;

  @Property({ type: "string", nullable: true })
  public note?: string | null = null;

  @Property({ type: "text", nullable: true })
  public link?: string | null = null;

  @Property({ type: "string", nullable: true })
  public description: string | null = null;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt?: ZonedDateTime | null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt?: ZonedDateTime | null;

  @ManyToOne(() => ProjectEntity, { ref: true, deleteRule: "cascade" })
  public project: Ref<ProjectEntity>;

  public constructor(parameters: {
    title: string;
    type: ResearchType;
    sources?: string | null;
    tag: string[] | null;
    note?: string | null;
    description: string | null;
    link?: string | null;
    project: ProjectEntity;
  }) {
    this.title = parameters.title;
    this.type = parameters.type;
    this.sources = parameters.sources;
    this.tag = parameters.tag;
    this.note = parameters.note;
    this.description = parameters.description;
    this.link = parameters.link;
    this.project = ref(parameters.project);
  }
}
