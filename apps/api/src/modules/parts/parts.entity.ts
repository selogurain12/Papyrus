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
import { Chapter } from "src/modules/chapters/chapters.entity";
import { Project } from "../projects/projects.entity";

@Entity()
export class Part {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "string" })
  public title: string;

  @Property({ type: "string", default: "toStart " })
  public status: "toStart" | "inProgress" | "completed";

  @OneToMany(() => Chapter, (chapter) => chapter.part)
  public chapters = new Collection<Chapter>(this);

  @ManyToOne(() => Project, { ref: true })
  public project: Ref<Project>;
}
