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
export class EventEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "string", nullable: true })
  public description: string | null = null;

  @Property({ type: "string", nullable: true })
  public importance: "critical" | "important" | "action" | "normal" | null = null;

  @Property({ type: "string", nullable: true })
  public location: string | null = null;

  @Property({ type: "text", nullable: true })
  public additionalDetails: string | null = null;

  @Property({ type: ZonedDateTimeType })
  public eventDate: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  public constructor(parameters: {
    title: string;
    description?: string | null;
    importance?: "critical" | "important" | "action" | "normal" | null;
    location?: string | null;
    additionalDetails?: string | null;
    eventDate: ZonedDateTime;
    project: ProjectEntity;
  }) {
    this.title = parameters.title;
    this.description = parameters.description ?? null;
    this.importance = parameters.importance ?? null;
    this.location = parameters.location ?? null;
    this.additionalDetails = parameters.additionalDetails ?? null;
    this.eventDate = parameters.eventDate;
    this.project = ref(parameters.project);
  }
}
