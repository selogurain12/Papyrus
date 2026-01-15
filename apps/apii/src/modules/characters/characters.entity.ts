import { randomUUID } from "node:crypto";
import { now, ZonedDateTime } from "@internationalized/date";
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  ref,
  type Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { ProjectEntity } from "../projects/projects.entity";
import { RelationshipEntity } from "../relationships/relationship.entity";

//TODO voir si on développe plus l'entité avec plus de données
@Entity()
export class CharacterEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public name: string;

  @Property({ type: "string" })
  public role: "protagonist" | "antagonist" | "ally" | "mentor" | "secondary character";

  @Property({ type: "string", nullable: true })
  public description: string | null = null;

  @Property({ type: "int", nullable: true })
  public age: number | null = null;

  @Property({ type: "string", nullable: true })
  public appearance: string | null = null;

  @Property({ type: "string", nullable: true })
  public personality: string | null = null;

  @Property({ type: "string", nullable: true })
  public story: string | null = null;

  @Property({ type: "string", nullable: true })
  public motivation: string | null = null;

  @Property({ type: "string", nullable: true })
  public color: string | null = null;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt?: ZonedDateTime | null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt?: ZonedDateTime | null;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  @OneToMany(() => RelationshipEntity, (relationship) => relationship.parentRelation)
  public parentRelationships = new Collection<RelationshipEntity>(this);

  @OneToMany(() => RelationshipEntity, (relationship) => relationship.childRelation)
  public childRelationships = new Collection<RelationshipEntity>(this);

  public constructor(parameters: {
    name: string;
    role: "protagonist" | "antagonist" | "ally" | "mentor" | "secondary character";
    description: string | null;
    age: number | null;
    appearance: string | null;
    personality: string | null;
    story: string | null;
    motivation: string | null;
    color: string | null;
    project: ProjectEntity;
  }) {
    this.name = parameters.name;
    this.role = parameters.role;
    this.description = parameters.description;
    this.age = parameters.age;
    this.appearance = parameters.appearance;
    this.personality = parameters.personality;
    this.story = parameters.story;
    this.motivation = parameters.motivation;
    this.color = parameters.color;
    this.project = ref(parameters.project);
  }
}
