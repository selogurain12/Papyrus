import { randomUUID } from "node:crypto";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  UuidType,
  type Ref,
} from "@mikro-orm/postgresql";
import { ZonedDateTime } from "@internationalized/date";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class HistoryEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({
    type: "string",
  })
  public type: "create" | "update" | "delete";

  @Property({
    type: "string",
  })
  public entity:
    | "mindmap"
    | "character"
    | "place"
    | "chapter"
    | "part"
    | "goal"
    | "event"
    | "export"
    | "note"
    | "object"
    | "research";

  @Property({
    type: ZonedDateTimeType,
  })
  public date: ZonedDateTime;

  @Property({
    type: "string",
  })
  public title: string;

  @ManyToOne(() => ProjectEntity, { ref: true, deleteRule: "cascade" })
  public project: Ref<ProjectEntity>;

  public constructor(params: {
    type: "create" | "update" | "delete";
    entity:
      | "mindmap"
      | "character"
      | "place"
      | "chapter"
      | "part"
      | "goal"
      | "event"
      | "export"
      | "note"
      | "object"
      | "research";
    date: ZonedDateTime;
    title: string;
    project: ProjectEntity;
  }) {
    this.type = params.type;
    this.entity = params.entity;
    this.date = params.date;
    this.title = params.title;
    this.project = ref(params.project);
  }
}
