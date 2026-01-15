import { randomUUID } from "node:crypto";
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  ref,
  Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { now, ZonedDateTime } from "@internationalized/date";
import { ChapterEntity } from "../../modules/chapters/chapters.entity";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class PartEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "string", default: "toStart " })
  public status: "toStart" | "inProgress" | "completed";

  @OneToMany(() => ChapterEntity, (chapter) => chapter.part)
  public chapters = new Collection<ChapterEntity>(this);

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  public constructor(parameters: {
    title: string;
    status: "toStart" | "inProgress" | "completed";
    project: ProjectEntity;
  }) {
    this.title = parameters.title;
    this.status = parameters.status;
    this.project = ref(parameters.project);
  }
}
