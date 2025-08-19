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
import { Relationships } from "../relationships/relationships.entity";

//TODO voir si on développe plus l'entité avec plus de données
@Entity()
export class Character {
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

  @Property({ type: ZonedDateTimeType })
  public createdAt: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;

  @ManyToMany(() => Object, (objects) => objects.characters)
  public objects = new Collection<Object>(this);

  @OneToMany(() => Relationships, (relationship) => relationship.parentRelation)
  public parentRelationships = new Collection<Relationships>(this);

  @OneToMany(() => Relationships, (relationship) => relationship.childRelation)
  public childRelationships = new Collection<Relationships>(this);
}
