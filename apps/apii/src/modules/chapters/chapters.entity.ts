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
import { PartEntity } from "../part/part.entity";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class ChapterEntity {
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

  @Property({ type: "text", nullable: true })
  public resume: string | null = null;

  @Property({ type: "int" })
  public chapterNumber: number;

  @Property({ type: "int", default: 0 })
  public wordCount: number;

  @Property({ type: "int", default: 500 })
  public wordGoal: number;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  @ManyToOne(() => PartEntity, { ref: true })
  public part: Ref<PartEntity>;

  public constructor(parameters: {
    title: string;
    status: "toStart" | "inProgress" | "completed";
    content: string | null;
    resume: string | null;
    chapterNumber: number;
    wordCount: number;
    wordGoal: number;
    project: ProjectEntity;
    part: PartEntity;
  }) {
    this.title = parameters.title;
    this.status = parameters.status;
    this.content = parameters.content;
    this.resume = parameters.resume;
    this.chapterNumber = parameters.chapterNumber;
    this.wordCount = parameters.wordCount;
    this.wordGoal = parameters.wordGoal;
    this.project = ref(parameters.project);
    this.part = ref(parameters.part);
  }
}
