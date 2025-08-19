import { randomUUID } from "node:crypto";
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Ref,
  UuidType,
} from "@mikro-orm/postgresql";
import { Connection } from "src/modules/connection/connection.entity";
import { MindMap } from "../mindmaps/mindmaps.entity";

@Entity()
export class Branches {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public color: string;

  @Property({ type: "string" })
  public title: string;

  @ManyToOne(() => MindMap, { ref: true })
  public mindMap: Ref<MindMap>;

  @OneToMany(() => Connection, (connection) => connection.branches)
  public connections = new Collection<Connection>(this);
}
