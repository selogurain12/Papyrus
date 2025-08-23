import { randomUUID } from "node:crypto";
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
import { Project } from "../projects/projects.entity";
import { Branches } from "../branches/branches.entity";
import { Character } from "../characters/characters.entity";
import { Place } from "../places/places.entity";
import { Object } from "../objects/objects.entity";
import { Events } from "../events/events.entity";

@Entity()
export class MindMap {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "text" })
  public type: "character" | "location" | "object" | "event";

  @ManyToOne(() => Character, { ref: true, nullable: true })
  public characterCenter: Ref<Character> | null;

  @ManyToOne(() => Place, { ref: true, nullable: true })
  public placeCenter: Ref<Place> | null;

  @ManyToOne(() => Object, { ref: true, nullable: true })
  public objectCenter: Ref<Object> | null;

  @ManyToOne(() => Events, { ref: true, nullable: true })
  public eventCenter: Ref<Events> | null;

  @OneToMany(() => Branches, (branches) => branches.mindMap)
  public branches = new Collection<Branches>(this);

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;
}
