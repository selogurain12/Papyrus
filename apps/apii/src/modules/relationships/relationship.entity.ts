import { randomUUID } from "node:crypto";
import { Entity, ManyToOne, PrimaryKey, Property, ref, Ref, UuidType } from "@mikro-orm/postgresql";
import { now, ZonedDateTime } from "@internationalized/date";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { CharacterEntity } from "../characters/characters.entity";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class RelationshipEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @ManyToOne(() => CharacterEntity, { ref: true })
  public parentRelation: Ref<CharacterEntity>;

  @ManyToOne(() => CharacterEntity, { ref: true })
  public childRelation: Ref<CharacterEntity>;

  @Property({ type: "string" })
  public type: string;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  public constructor(parameters: {
    parentRelation: CharacterEntity;
    childRelation: CharacterEntity;
    type: string;
    project: ProjectEntity;
  }) {
    this.parentRelation = ref(parameters.parentRelation);
    this.childRelation = ref(parameters.childRelation);
    this.type = parameters.type;
    this.project = ref(parameters.project);
  }
}
