import { randomUUID } from "node:crypto";
import { ZonedDateTime } from "@internationalized/date";
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { LanguageType } from "@papyrus/source";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { Project } from "../projects/projects.entity";
import { MindMap } from "../mindmaps/mindmaps.entity";

@Entity()
export class Place {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public name: string;

  @Property({ type: "string", nullable: true })
  public nickname: string | null = null;

  @Property({ type: "array" })
  public type: string[];

  @Property({ type: "text" })
  public localisation: string;

  @Property({ type: "string", nullable: true })
  public physicalDescription: string | null = null;

  @Property({ type: "text", nullable: true })
  public atmosphere: string | null = null;

  @Property({ type: "text", nullable: true })
  public history: string | null = null;

  @Property({ type: "text", nullable: true })
  public population: string | null = null;

  @Property({ type: "text", nullable: true })
  public usages: string | null = null;

  @Property({ type: "string", nullable: true })
  public language: LanguageType | null = null;

  @Property({ type: "string", nullable: true })
  public government: string | null = null;

  @Property({ type: "string", nullable: true })
  public resources: string | null = null;

  @Property({ type: "string", nullable: true })
  public narrativeImportance: string | null = null;

  @Property({ type: ZonedDateTimeType })
  public createdAt: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;

  @OneToMany(() => MindMap, (mindMap) => mindMap.placeCenter)
  public mindMaps = new Collection<MindMap>(this);
}
