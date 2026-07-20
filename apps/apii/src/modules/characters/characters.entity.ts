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
import { ColorType, GenderType, RoleType } from "@papyrus/source";
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
  public role: RoleType;

  @Property({ type: "int" })
  public roleStar: number;

  //état civil
  @Property({ type: "string" })
  public firstName: string;

  @Property({ type: "string" })
  public lastName: string;

  @Property({ type: "string" })
  public nickName: string;

  @Property({ type: "string" })
  public pronouns: string;

  @Property({ type: "string" })
  public gender: GenderType;

  @Property({ type: "string", nullable: true })
  public nationality: string | null;

  @Property({ type: "int", nullable: true })
  public age: number | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public birthDate: ZonedDateTime | null;

  @Property({ type: "string", nullable: true })
  public birthPlace: string | null;

  @Property({ type: "string", nullable: true })
  public residencePlace: string | null;

  @Property({ type: "string", nullable: true })
  public occupation: string | null;

  //physique
  @Property({ type: "int", nullable: true })
  public height: number | null;

  @Property({ type: "int", nullable: true })
  public weight: number | null;

  @Property({ type: "string", nullable: true })
  public corpulence: string | null;

  @Property({ type: "string", nullable: true })
  public hairColor: string | null;

  @Property({ type: "string", nullable: true })
  public eyesColor: string | null;

  @Property({ type: "string", nullable: true })
  public voice: string | null;

  @Property({ type: "string", nullable: true })
  public outfit: string | null;

  @Property({ type: "string", nullable: true })
  public accessory: string | null;

  @Property({ type: "string", nullable: true })
  public description: string | null = null;

  //caractère
  @Property({ type: "array", nullable: true })
  public characterQualities: string[] | null;

  @Property({ type: "array", nullable: true })
  public characterFlaws: string[] | null;

  @Property({ type: "string", nullable: true })
  public tastes: string | null;

  @Property({ type: "string", nullable: true })
  public tics: string | null;

  @Property({ type: "string", nullable: true })
  public fears: string | null;

  //profile
  @Property({ type: "string", nullable: true })
  public education: string | null;

  @Property({ type: "string", nullable: true })
  public class: string | null;

  @Property({ type: "string", nullable: true })
  public belief: string | null;

  @Property({ type: "string", nullable: true })
  public secrets: string | null;

  @Property({ type: "string", nullable: true })
  public notablePlaces: string | null;

  @Property({ type: "string", nullable: true })
  public typicalExpression: string | null;

  //evolution
  @Property({ type: "string", nullable: true })
  public goals: string | null;

  @Property({ type: "string", nullable: true })
  public past: string | null;

  @Property({ type: "string", nullable: true })
  public present: string | null;

  @Property({ type: "string", nullable: true })
  public future: string | null;

  //autre
  @Property({ type: "text", nullable: true })
  public notes: string | null;

  @Property({ type: "string", nullable: true })
  public color: ColorType | null = null;

  @Property({ type: "text", nullable: true })
  public avatarLink: string | null = null;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt?: ZonedDateTime | null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt?: ZonedDateTime | null;

  @ManyToOne(() => ProjectEntity, { ref: true, deleteRule: "cascade" })
  public project: Ref<ProjectEntity>;

  @OneToMany(() => RelationshipEntity, (relationship) => relationship.parentRelation)
  public parentRelationships = new Collection<RelationshipEntity>(this);

  @OneToMany(() => RelationshipEntity, (relationship) => relationship.childRelation)
  public childRelationships = new Collection<RelationshipEntity>(this);

  public constructor(parameters: {
    roleStar: number;
    role: RoleType;
    firstName: string;
    lastName: string;
    nickName: string;
    pronouns: string;
    gender: GenderType;
    nationality: string | null;
    age: number | null;
    birthDate: ZonedDateTime | null;
    birthPlace: string | null;
    residencePlace: string | null;
    occupation: string | null;
    height: number | null;
    weight: number | null;
    corpulence: string | null;
    hairColor: string | null;
    eyesColor: string | null;
    voice: string | null;
    outfit: string | null;
    accessory: string | null;
    description: string | null;
    characterQualities: string[] | null;
    characterFlaws: string[] | null;
    tastes: string | null;
    tics: string | null;
    fears: string | null;
    education: string | null;
    class: string | null;
    belief: string | null;
    secrets: string | null;
    notablePlaces: string | null;
    typicalExpression: string | null;
    goals: string | null;
    past: string | null;
    present: string | null;
    future: string | null;
    notes: string | null;
    color: ColorType | null;
    avatarLink?: string | null;
    project: ProjectEntity;
  }) {
    this.roleStar = parameters.roleStar;
    this.role = parameters.role;
    this.firstName = parameters.firstName;
    this.lastName = parameters.lastName;
    this.nickName = parameters.nickName;
    this.pronouns = parameters.pronouns;
    this.gender = parameters.gender;
    this.nationality = parameters.nationality;
    this.age = parameters.age;
    this.birthDate = parameters.birthDate;
    this.birthPlace = parameters.birthPlace;
    this.residencePlace = parameters.residencePlace;
    this.occupation = parameters.occupation;
    this.height = parameters.height;
    this.weight = parameters.weight;
    this.corpulence = parameters.corpulence;
    this.hairColor = parameters.hairColor;
    this.eyesColor = parameters.eyesColor;
    this.voice = parameters.voice;
    this.outfit = parameters.outfit;
    this.accessory = parameters.accessory;
    this.description = parameters.description;
    this.characterQualities = parameters.characterQualities;
    this.characterFlaws = parameters.characterFlaws;
    this.tastes = parameters.tastes;
    this.tics = parameters.tics;
    this.fears = parameters.fears;
    this.education = parameters.education;
    this.class = parameters.class;
    this.belief = parameters.belief;
    this.secrets = parameters.secrets;
    this.notablePlaces = parameters.notablePlaces;
    this.typicalExpression = parameters.typicalExpression;
    this.goals = parameters.goals;
    this.past = parameters.past;
    this.present = parameters.present;
    this.future = parameters.future;
    this.notes = parameters.notes;
    this.color = parameters.color;
    this.avatarLink = parameters.avatarLink ?? null;
    this.project = ref(parameters.project);
  }
}
