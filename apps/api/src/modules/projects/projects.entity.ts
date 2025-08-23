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
import { type LanguageType } from "@papyrus/source";
import { ZonedDateTimeType } from "../../utils/zoned-date-time";
import { User } from "../users/users.entity";
import { Settings } from "../settings/settings.entity";
import { Character } from "../characters/characters.entity";
import { Place } from "../places/places.entity";
import { Object } from "../objects/objects.entity";
import { Chapter } from "../chapters/chapters.entity";
import { Events } from "../events/events.entity";
import { Research } from "../research/research.entity";
import { Note } from "../notes/notes.entity";
import { MindMap } from "../mindmaps/mindmaps.entity";
import { Architecture } from "../architecture/architecture.entity";
import { Part } from "../parts/parts.entity";

@Entity()
export class Project {
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

  @Property({ type: "int", default: 100000 })
  public targetWordCount: number;

  @Property({ type: "int", default: 0 })
  public currentWordCount: number;

  @Property({ default: "planning", type: "string" })
  public status: "planning" | "writing" | "editing" | "completed";

  @Property({ type: "string" })
  public author: string;

  @Property({ default: "fr", type: "string" })
  public language: LanguageType;

  @Property({ type: ZonedDateTimeType })
  public deadline: ZonedDateTime;

  @ManyToOne(() => Settings, { ref: true })
  public settings: Ref<Settings>;

  @Property({ type: ZonedDateTimeType })
  public createdAt!: ZonedDateTime;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public updatedAt: ZonedDateTime | null = null;

  @Property({ type: ZonedDateTimeType, nullable: true })
  public deletedAt: ZonedDateTime | null = null;

  @ManyToOne(() => User, { ref: true })
  public user: Ref<User>;

  @OneToMany(() => Architecture, (architecture) => architecture.project)
  public architectures = new Collection<Architecture>(this);

  @OneToMany(() => Chapter, (chapter) => chapter.project)
  public chapters = new Collection<Chapter>(this);

  @OneToMany(() => Character, (character) => character.project)
  public characters = new Collection<Character>(this);

  @OneToMany(() => MindMap, (mindMap) => mindMap.project)
  public mindMaps = new Collection<MindMap>(this);

  @OneToMany(() => Note, (note) => note.project)
  public notes = new Collection<Note>(this);

  @OneToMany(() => Object, (object) => object.project)
  public objects = new Collection<Object>(this);

  @OneToMany(() => Part, (part) => part.project)
  public parts = new Collection<Part>(this);

  @OneToMany(() => Place, (place) => place.project)
  public places = new Collection<Place>(this);

  @OneToMany(() => Research, (research) => research.project)
  public research = new Collection<Research>(this);

  @OneToMany(() => Events, (event) => event.project)
  public timelineEvents = new Collection<Events>(this);
}
