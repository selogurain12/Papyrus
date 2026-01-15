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
export class ObjectEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public name: string;

  @Property({ type: "string", nullable: true })
  public importance: "high" | "medium" | "low" | null = null;

  @Property({ type: "text", nullable: true })
  public description: string | null = null;

  @Property({ type: "text", nullable: true })
  public appearance: string | null = null;

  @Property({ type: "text", nullable: true })
  public significance: string | null = null;

  @Property({ type: "text", nullable: true })
  public location: string | null = null;

  @Property({ type: "string", nullable: true })
  public type: string | null = null;

  @Property({ type: "text", nullable: true })
  public history: string | null = null;

  @Property({ type: "string", nullable: true })
  public color: string | null = null;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  public constructor(parameters: {
    name: string;
    type: string | null;
    importance: "high" | "medium" | "low" | null;
    description: string | null;
    appearance: string | null;
    significance: string | null;
    location: string | null;
    history: string | null;
    color: string | null;
    project: ProjectEntity;
  }) {
    this.name = parameters.name;
    this.type = parameters.type;
    this.importance = parameters.importance;
    this.description = parameters.description;
    this.appearance = parameters.appearance;
    this.significance = parameters.significance;
    this.location = parameters.location;
    this.history = parameters.history;
    this.color = parameters.color;
    this.project = ref(parameters.project);
  }
}
