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
    content: string | null;
    project: ProjectEntity;
    tags: string[] | null;
  }) {
    this.title = parameters.title;
    this.content = parameters.content;
    this.project = ref(parameters.project);
    this.tags = parameters.tags;
  }
}
