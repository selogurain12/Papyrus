import { randomUUID } from "node:crypto";
import { Entity, ManyToOne, PrimaryKey, Property, Ref, UuidType } from "@mikro-orm/postgresql";
import { Project } from "../projects/projects.entity";

@Entity()
export class Architecture {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "text" })
  public firstIdea: string;

  @Property({ type: "text" })
  public plan: string;

  @Property({ type: "text" })
  public environnement: string;

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;
}
