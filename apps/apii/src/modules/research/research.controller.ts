import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { researchContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { ResearchService } from "./research.service";

@Controller()
@UseGuards(AuthGuard)
export class ResearchController {
  private readonly service: ResearchService;

  public constructor(service: ResearchService) {
    this.service = service;
  }

  @TsRestHandler(researchContract)
  public handle() {
    return tsRestHandler(researchContract, {
      create: async ({ params: parameters, body: dto }) => {
        const researchs = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: researchs };
      },
      getAll: async ({ query, params: parameters }) => {
        const researchs = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: researchs };
      },
      get: async ({ params: parameters }) => {
        const researchs = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: researchs };
      },
      update: async ({ params: parameters, body: dto }) => {
        const researchs = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: researchs };
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
