import { Controller, UseGuards } from "@nestjs/common";
import { architectureContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { ArchitectureService } from "./architecture.service";

@Controller()
@UseGuards(AuthGuard)
export class ArchitectureController {
  private readonly service: ArchitectureService;

  public constructor(service: ArchitectureService) {
    this.service = service;
  }

  @TsRestHandler(architectureContract)
  public handle() {
    return tsRestHandler(architectureContract, {
      create: async ({ params: parameters, body: dto }) => {
        const architecture = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: architecture };
      },
      getAll: async ({ query, params: parameters }) => {
        const architectures = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: architectures };
      },
      get: async ({ params: parameters }) => {
        const architecture = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: architecture };
      },
      update: async ({ params: parameters, body: dto }) => {
        const architecture = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: architecture };
      },
      delete: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.projectId);
        return { status: 200, body: undefined };
      },
    });
  }
}
