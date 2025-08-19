import { randomUUID } from "node:crypto";
import { ZonedDateTime } from "@internationalized/date";
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { Project } from "../projects/projects.entity";
import { Object } from "../objects/objects.entity";
import { MindMap } from "../mindmaps/mindmaps.entity";

@Entity()
export class TimelineEvent {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "string", nullable: true })
  public description: string | null = null;

  @Property({ type: ZonedDateTimeType })
  public eventDate: ZonedDateTime;

  @Property({ type: ZonedDateTimeType })
  public createdAt: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;

  @ManyToMany(() => Object, (object) => object.events)
  public objects = new Collection<Object>(this);

  @OneToMany(() => MindMap, (mindMap) => mindMap.eventCenter)
  public mindMaps = new Collection<MindMap>(this);
}
