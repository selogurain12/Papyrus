import { Controller, UseGuards } from "@nestjs/common";
import { projectContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { ProjectService } from "./projects.service";

@Controller()
@UseGuards(AuthGuard)
export class ProjectController {
  private readonly service: ProjectService;

  public constructor(service: ProjectService) {
    this.service = service;
  }

  @TsRestHandler(projectContract)
  public handle() {
    return tsRestHandler(projectContract, {
      create: async ({ params: parameters, body: dto }) => {
        const project = await this.service.create(dto, parameters.userId);
        return { status: 201, body: project };
      },
      getAll: async ({ query, params: parameters }) => {
        const projects = await this.service.getAll(query, parameters.userId);
        return { status: 200, body: projects };
      },
      get: async ({ params: parameters }) => {
        const project = await this.service.get(parameters.id, parameters.userId);
        return { status: 200, body: project };
      },
      update: async ({ params: parameters, body: dto }) => {
        const project = await this.service.update(parameters.id, dto, parameters.userId);
        return { status: 200, body: project };
      },
      softDelete: async ({ params: parameters }) => {
        await this.service.softDelete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
      delete: async ({ params: parameters }) => {
        await this.service.delete(parameters.id, parameters.userId);
        return { status: 200, body: undefined };
      },
    });
  }
}
