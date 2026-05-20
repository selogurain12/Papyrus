import * as path from "path";
import * as fs from "fs";

import { MikroORM } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import Epub from "epub-gen";

import { PartService } from "../part/part.service";
import { ChapterService } from "../chapters/chapters.service";
import { ProjectService } from "../projects/projects.service";

@Injectable()
export class ExportService {
  private readonly outputDir = path.join(process.cwd(), "exports");

  public constructor(
    private readonly orm: MikroORM,
    private readonly projectService: ProjectService,
    private readonly partService: PartService,
    private readonly chapterService: ChapterService
  ) {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, {
        recursive: true,
      });
    }
  }

  public async exportEpub(projectId: string, userId: string): Promise<{ url: string }> {
    const project = await this.projectService.get(projectId, userId);

    if (!project) {
      throw new Error("Project not found");
    }

    const parts = await this.partService.getAll({ disablePagination: true }, projectId);

    const content: {
      title: string;
      data: string;
    }[] = [];

    for (const part of parts.data) {
      content.push({
        title: part.title,
        data: `
          <h1>${part.title}</h1>
        `,
      });

      const chapters = await this.chapterService.getByPart(part.id, projectId);

      for (const chapter of chapters.data) {
        content.push({
          title: chapter.title,
          data: `
            <h2>${chapter.title}</h2>

            <div>
              ${chapter.content ?? ""}
            </div>
          `,
        });
      }
    }

    const safeTitle = project.title.replace(/[^a-zA-Z0-9]/g, "_");

    const fileName = `${safeTitle}.epub`;

    const outputPath = path.join(this.outputDir, fileName);

    await new Epub({
      title: project.title,
      author: project.author,
      output: outputPath,
      content,
    });

    return {
      url: `${process.env.API_URL}/exports/${fileName}`,
    };
  }
}
