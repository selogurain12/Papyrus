import { randomUUID } from "node:crypto";
import { Entity, ManyToOne, PrimaryKey, Property, Ref, UuidType } from "@mikro-orm/postgresql";
import { Character } from "../characters/characters.entity";

@Entity()
export class Relationships {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @ManyToOne(() => Character, { ref: true })
  public parentRelation: Ref<Character>;

  @ManyToOne(() => Character, { ref: true })
  public childRelation: Ref<Character>;

  @Property({ type: "string" })
  public type: string;
}
