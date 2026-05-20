import * as path from "path";
import * as fs from "fs";
import { MikroORM } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { EPub } from "@lesjoursfr/html-to-epub";
import { PartService } from "../part/part.service";
import { ChapterService } from "../chapters/chapters.service";
import { ProjectService } from "../projects/projects.service";

@Injectable()
export class ExportService {
  private readonly orm: MikroORM;
  private readonly projectService: ProjectService;
  private readonly partService: PartService;
  private readonly chapterService: ChapterService;
  private readonly outputDir = path.join(process.cwd(), "exports");
  public constructor(
    orm: MikroORM,
    projectService: ProjectService,
    partService: PartService,
    chapterService: ChapterService
  ) {
    this.orm = orm;
    this.projectService = projectService;
    this.partService = partService;
    this.chapterService = chapterService;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  public async exportEpub(projectId: string, userId: string): Promise<{ url: string }> {
    const project = await this.projectService.get(projectId, userId);
    if (!project) {
      throw new Error("Project not found");
    }

    const parts = await this.partService.getAll(projectId);

    const content: { title: string; data: string }[] = [];
    for (const part of parts.data) {
      content.push({
        title: part.title ?? "Partie",
        data: `<h1>${part.title ?? "Partie"}</h1>`,
      });

      const chapters = await this.chapterService.getByPart(part.id, projectId);

      for (const chapter of chapters.data) {
        content.push({
          title: chapter.title ?? "Chapitre",
          data: `
            <h2>${chapter.title ?? ""}</h2>
            <div>${chapter.content ?? ""}</div>
          `,
        });
      }
    }

    const fileName = `${project.title.replace(/[^a-zA-Z0-9]/g, "_")}.epub`;
    const outputPath = path.join(this.outputDir, fileName);

    const epub = new EPub(
      {
        title: project.title,
        author: project.author ?? "Unknown",
        output: outputPath,
        content,
        version: 3,
      },
      outputPath
    );

    await epub.render();

    return {
      url: outputPath,
    };
  }
}
