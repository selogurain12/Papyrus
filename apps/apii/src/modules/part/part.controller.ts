import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { partContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { PartService } from "./part.service";

@Controller()
@UseGuards(AuthGuard)
export class PartController {
  private readonly service: PartService;

  public constructor(service: PartService) {
    this.service = service;
  }

  @TsRestHandler(partContract)
  public handle() {
    return tsRestHandler(partContract, {
      create: async ({ params: parameters, body: dto }) => {
        const parts = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: parts };
      },
      getAll: async ({ query, params: parameters }) => {
        const parts = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: parts };
      },
      get: async ({ params: parameters }) => {
        const parts = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: parts };
      },
      update: async ({ params: parameters, body: dto }) => {
        const parts = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: parts };
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
