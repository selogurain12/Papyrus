import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { objectContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { ObjectService } from "./objects.service";

@Controller()
@UseGuards(AuthGuard)
export class ObjectController {
  private readonly service: ObjectService;

  public constructor(service: ObjectService) {
    this.service = service;
  }

  @TsRestHandler(objectContract)
  public handle() {
    return tsRestHandler(objectContract, {
      create: async ({ params: parameters, body: dto }) => {
        const object = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: object };
      },
      getAll: async ({ query, params: parameters }) => {
        const objects = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: objects };
      },
      get: async ({ params: parameters }) => {
        const object = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: object };
      },
      update: async ({ params: parameters, body: dto }) => {
        const object = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: object };
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
