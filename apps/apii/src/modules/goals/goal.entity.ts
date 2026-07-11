import { randomUUID } from "node:crypto";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { now, ZonedDateTime } from "@internationalized/date";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class GoalEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public type: "daily" | "weekly" | "monthly" | "project";

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "number" })
  public goals: number;

  @Property({ type: "number", default: 0 })
  public current: number = 0;

  @Property({ type: "number", default: 0 })
  public currentBaseline: number = 0;

  @Property({ type: "string" })
  public unit: "words" | "hours" | "chapters";

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deadline: ZonedDateTime | null = null;

  @Property({ type: "text", nullable: true })
  public description: string | null = null;

  @Property({ type: "string", nullable: true })
  public status: "warning" | "urgent" | "overdue" | null = null;

  @Property({ type: "boolean" })
  public isOpen: boolean = true;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => ProjectEntity, { ref: true, deleteRule: "cascade" })
  public project: Ref<ProjectEntity>;

  public constructor(parameters: {
    type: "daily" | "weekly" | "monthly" | "project";
    title: string;
    goals: number;
    unit: "words" | "hours" | "chapters";
    project: ProjectEntity;
    deadline?: ZonedDateTime | null;
    description?: string | null;
    status?: "warning" | "urgent" | "overdue" | null;
    currentBaseline?: number;
  }) {
    this.type = parameters.type;
    this.title = parameters.title;
    this.goals = parameters.goals;
    this.unit = parameters.unit;
    this.currentBaseline = parameters.currentBaseline ?? 0;
    this.project = ref(parameters.project);
    this.deadline = parameters.deadline ?? null;
    this.description = parameters.description ?? null;
    this.status = parameters.status ?? null;
  }
}
