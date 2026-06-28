import { Readable } from "stream";
import { Controller, StreamableFile, UseGuards } from "@nestjs/common";

import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";

import { exportContract } from "@papyrus/source";

import { AuthGuard } from "../authentification/authentification.guard";

import { ExportService } from "./export.service";

@Controller()
@UseGuards(AuthGuard)
export class ExportController {
  private readonly service: ExportService;
  public constructor(service: ExportService) {
    this.service = service;
  }

  @TsRestHandler(exportContract)
  public handle() {
    return tsRestHandler(exportContract, {
      epub: async ({ params: parameters, query }) => {
        const { fileName, buffer } = await this.service.exportEpub(
          parameters.projectId,
          parameters.userId,
          query
        );

        return {
          status: 200,
          body: new StreamableFile(Readable.from(buffer), {
            type: "application/epub+zip",
            disposition: `attachment; filename="${fileName}"`,
          }),
        };
      },
      pdf: async ({ params: parameters, query }) => {
        const { fileName, buffer } = await this.service.exportPdf(
          parameters.projectId,
          parameters.userId,
          query
        );

        return {
          status: 200,
          body: new StreamableFile(Readable.from(buffer), {
            type: "application/pdf",
            disposition: `attachment; filename="${fileName}"`,
          }),
        };
      },
      docx: async ({ params: parameters, query }) => {
        const { fileName, buffer } = await this.service.exportDocx(
          parameters.projectId,
          parameters.userId,
          query
        );

        return {
          status: 200,
          body: new StreamableFile(Readable.from(buffer), {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            disposition: `attachment; filename="${fileName}"`,
          }),
        };
      },
      txt: async ({ params: parameters, query }) => {
        const { fileName, buffer } = await this.service.exportTxt(
          parameters.projectId,
          parameters.userId,
          query
        );

        return {
          status: 200,
          body: new StreamableFile(Readable.from(buffer), {
            type: "text/plain; charset=utf-8",
            disposition: `attachment; filename="${fileName}"`,
          }),
        };
      },
    });
  }
}
