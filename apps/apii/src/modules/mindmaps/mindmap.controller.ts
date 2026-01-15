import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { mindmapContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { MindmapService } from "./mindmap.service";

@Controller()
@UseGuards(AuthGuard)
export class MindmapController {
  private readonly service: MindmapService;

  public constructor(service: MindmapService) {
    this.service = service;
  }

  @TsRestHandler(mindmapContract)
  public handle() {
    return tsRestHandler(mindmapContract, {
      create: async ({ params: parameters, body: dto }) => {
        const mindmaps = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: mindmaps };
      },
      getAll: async ({ query, params: parameters }) => {
        const mindmaps = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: mindmaps };
      },
      get: async ({ params: parameters }) => {
        const mindmaps = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: mindmaps };
      },
      update: async ({ params: parameters, body: dto }) => {
        const mindmaps = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: mindmaps };
      },
      softDelete: async ({ params: parameters }) => {
        await this.service.softDelete(parameters.id, parameters.projectId);
        return { status: 200, body: undefined };
      },
      delete: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.projectId);
        return { status: 200, body: undefined };
      },
    });
  }
}
