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
import { Character } from "../characters/characters.entity";
import { Events } from "../events/events.entity";
import { MindMap } from "../mindmaps/mindmaps.entity";

@Entity()
export class Object {
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

  @ManyToMany(() => Character, (character) => character.objects)
  public characters = new Collection<Character>(this);

  @ManyToMany(() => Events, (event) => event.objects)
  public events = new Collection<Events>(this);

  @Property({ type: ZonedDateTimeType })
  public createdAt: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;

  @OneToMany(() => MindMap, (mindMap) => mindMap.objectCenter)
  public mindMaps = new Collection<MindMap>(this);
}
