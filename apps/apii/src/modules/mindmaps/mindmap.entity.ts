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
import type { MindElixirData } from "@papyrus/source";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class MindmapEntity {
  @PrimaryKey({ type: UuidType })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "json" })
  public data: MindElixirData;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  public constructor(parameters: { title: string; data: MindElixirData; project: ProjectEntity }) {
    this.title = parameters.title;
    this.data = parameters.data;
    this.project = ref(parameters.project);
  }
}
