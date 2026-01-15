import { randomUUID } from "node:crypto";
import { Entity, ManyToOne, PrimaryKey, Property, ref, Ref, UuidType } from "@mikro-orm/postgresql";
import { ProjectEntity } from "../projects/projects.entity";

@Entity()
export class ArchitectureEntity {
  @PrimaryKey({
    type: UuidType,
  })
  public id: string = randomUUID();

  @Property({ type: "text", nullable: true })
  public firstIdea: string | null;

  @Property({ type: "text", nullable: true })
  public plan: string | null;

  @Property({ type: "text", nullable: true })
  public environnement: string | null;

  @ManyToOne(() => ProjectEntity, { ref: true })
  public project: Ref<ProjectEntity>;

  public constructor(parameters: {
    firstIdea: string | null;
    plan: string | null;
    environnement: string | null;
    project: ProjectEntity;
  }) {
    this.firstIdea = parameters.firstIdea;
    this.plan = parameters.plan;
    this.environnement = parameters.environnement;
    this.project = ref(parameters.project);
  }
}
