import { randomUUID } from "node:crypto";
import { Entity, ManyToOne, PrimaryKey, Property, Ref, UuidType } from "@mikro-orm/postgresql";
import { Branches } from "src/modules/branches/branches.entity";

@Entity()
export class Connection {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @ManyToOne(() => Branches, { ref: true })
  public branches: Ref<Branches>;

  @Property({ type: "string" })
  public name: string;

  @Property({ type: "string" })
  public relation: string;

  @Property({ type: "string" })
  public strength: "strong" | "average" | "weak" | "conflicting" | "critical";
}
