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
import { type LanguageType } from "@papyrus/source";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { UserEntity } from "../users/users.entity";
import { SettingEntity } from "../settings/settings.entity";
import { CharacterEntity } from "../characters/characters.entity";
import { PlaceEntity } from "../places/place.entity";
import { ObjectEntity } from "../objects/objects.entity";
import { ChapterEntity } from "../chapters/chapters.entity";
import { EventEntity } from "../events/events.entity";
import { ResearchEntity } from "../research/research.entity";
import { NoteEntity } from "../notes/note.entity";
import { MindmapEntity } from "../mindmaps/mindmap.entity";
import { ArchitectureEntity } from "../architecture/architecture.entity";
import { PartEntity } from "../part/part.entity";

@Entity()
export class ProjectEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "string", nullable: true })
  public description: string | null;

  @Property({ type: "string" })
  public genre: string;

  @Property({ type: "int", default: 10000 })
  public targetWordCount: number;

  @Property({ type: "int", default: 0 })
  public currentWordCount: number;

  @Property({ default: "planning", type: "string" })
  public status: "planning" | "writing" | "editing" | "completed";

  @Property({ type: "string" })
  public author: string;

  @Property({ default: "fr", type: "string" })
  public language: LanguageType;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deadline: ZonedDateTime | null = null;

  @ManyToOne(() => SettingEntity, { ref: true, deleteRule: "cascade" })
  public settings: Ref<SettingEntity>;

  @Property({ type: ZonedDateTimeType, onCreate: () => now("UTC") })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true, onUpdate: () => now("UTC") })
  public updatedAt?: ZonedDateTime | null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt?: ZonedDateTime | null;

  @ManyToOne(() => UserEntity, { ref: true })
  public user!: Ref<UserEntity>;

  @OneToMany(() => ArchitectureEntity, (architecture) => architecture.project)
  public architectures = new Collection<ArchitectureEntity>(this);

  @OneToMany(() => ChapterEntity, (chapter) => chapter.project)
  public chapters = new Collection<ChapterEntity>(this);

  @OneToMany(() => CharacterEntity, (character) => character.project)
  public characters = new Collection<CharacterEntity>(this);

  @OneToMany(() => MindmapEntity, (mindMap) => mindMap.project)
  public mindMaps = new Collection<MindmapEntity>(this);

  @OneToMany(() => NoteEntity, (note) => note.project)
  public notes = new Collection<NoteEntity>(this);

  @OneToMany(() => ObjectEntity, (object) => object.project)
  public objects = new Collection<ObjectEntity>(this);

  @OneToMany(() => PartEntity, (part) => part.project)
  public parts = new Collection<PartEntity>(this);

  @OneToMany(() => PlaceEntity, (place) => place.project)
  public places = new Collection<PlaceEntity>(this);

  @OneToMany(() => ResearchEntity, (research) => research.project)
  public research = new Collection<ResearchEntity>(this);

  @OneToMany(() => EventEntity, (event) => event.project)
  public timelineEvents = new Collection<EventEntity>(this);

  public constructor(parameters: {
    title: string;
    description: string | null;
    genre: string;
    targetWordCount: number;
    currentWordCount: number;
    status: "planning" | "writing" | "editing" | "completed";
    author: string;
    language: LanguageType;
    deadline: ZonedDateTime | null;
    settings: SettingEntity;
    user: UserEntity;
  }) {
    this.title = parameters.title;
    this.description = parameters.description;
    this.genre = parameters.genre;
    this.targetWordCount = parameters.targetWordCount;
    this.currentWordCount = parameters.currentWordCount;
    this.status = parameters.status;
    this.author = parameters.author;
    this.language = parameters.language;
    this.deadline = parameters.deadline;
    this.settings = ref(parameters.settings);
    this.user = ref(parameters.user);
  }
}
