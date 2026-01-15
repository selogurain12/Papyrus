import { randomUUID } from "node:crypto";
import { ZonedDateTime } from "@internationalized/date";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { LanguageType } from "@papyrus/source";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class PlaceEntity {
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
  public ressources: string | null = null;

  @Property({ type: "string", nullable: true })
  public narrativeImportance: string | null = null;

  @Property({ type: ZonedDateTimeType })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  // eslint-disable-next-line complexity
  public constructor(parameters: {
    name: string;
    nickname?: string | null;
    type: string[];
    localisation: string;
    physicalDescription?: string | null;
    atmosphere?: string | null;
    history?: string | null;
    population?: string | null;
    usages?: string | null;
    language?: LanguageType | null;
    government?: string | null;
    ressources?: string | null;
    narrativeImportance?: string | null;
    project: ProjectEntity;
  }) {
    this.name = parameters.name;
    this.nickname = parameters.nickname ?? null;
    this.type = parameters.type;
    this.localisation = parameters.localisation;
    this.physicalDescription = parameters.physicalDescription ?? null;
    this.atmosphere = parameters.atmosphere ?? null;
    this.history = parameters.history ?? null;
    this.population = parameters.population ?? null;
    this.usages = parameters.usages ?? null;
    this.language = parameters.language ?? null;
    this.government = parameters.government ?? null;
    this.ressources = parameters.ressources ?? null;
    this.narrativeImportance = parameters.narrativeImportance ?? null;
    this.project = ref(parameters.project);
  }
}
