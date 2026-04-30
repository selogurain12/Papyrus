import { randomUUID } from "node:crypto";
import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  UuidType,
} from "@mikro-orm/postgresql";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class StructureEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "text", nullable: true })
  public premise: string | null = null;

  @Property({ type: "text", nullable: true })
  public genre: string | null = null;

  @Property({ type: "text", nullable: true })
  public theme: string | null = null;

  @Property({ type: "text", nullable: true })
  public structure: string | null = null;

  @Property({ type: "array", nullable: true })
  public objectives: string[] | null = null;

  @OneToMany(() => ProjectEntity, (project) => project.structure)
  public projects = new Collection<ProjectEntity>(this);
}
