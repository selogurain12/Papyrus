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
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class NoteEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "text", nullable: true })
  public content: string | null = null;

  @Property({ type: "array", nullable: true })
  public tags: string[] | null = null;

  @Property({ type: "text", nullable: true })
  public linkFile: string | null = null;

  @Property({ type: "string" })
  public color: string;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => ProjectEntity, { ref: true, deleteRule: "cascade" })
  public project: Ref<ProjectEntity>;

  public constructor(parameters: {
    title: string;
    content: string | null;
    linkFile: string | null;
    color: string;
    project: ProjectEntity;
    tags: string[] | null;
  }) {
    this.title = parameters.title;
    this.content = parameters.content;
    this.linkFile = parameters.linkFile;
    this.color = parameters.color;
    this.project = ref(parameters.project);
    this.tags = parameters.tags;
  }
}
