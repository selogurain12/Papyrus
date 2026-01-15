import { Controller, UseGuards } from "@nestjs/common";
import { chapterContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { ChapterService } from "./chapters.service";

@Controller()
@UseGuards(AuthGuard)
export class ChapterController {
  private readonly service: ChapterService;

  public constructor(service: ChapterService) {
    this.service = service;
  }

  @TsRestHandler(chapterContract)
  public handle() {
    return tsRestHandler(chapterContract, {
      create: async ({ params: parameters, body: dto }) => {
        const chapters = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: chapters };
      },
      getAll: async ({ query, params: parameters }) => {
        const chapters = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: chapters };
      },
      get: async ({ params: parameters }) => {
        const chapters = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: chapters };
      },
      update: async ({ params: parameters, body: dto }) => {
        const chapters = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: chapters };
      },
      softDelete: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.projectId);
        return { status: 200, body: undefined };
      },
      delete: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.projectId);
        return { status: 200, body: undefined };
      },
    });
  }
}
