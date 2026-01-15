import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { relationshipContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { RelationshipsService } from "./relationship.service";

@Controller()
@UseGuards(AuthGuard)
export class RelationshipController {
  private readonly service: RelationshipsService;

  public constructor(service: RelationshipsService) {
    this.service = service;
  }

  @TsRestHandler(relationshipContract)
  public handle() {
    return tsRestHandler(relationshipContract, {
      create: async ({ params: parameters, body: dto }) => {
        const relationships = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: relationships };
      },
      getAll: async ({ query, params: parameters }) => {
        const relationships = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: relationships };
      },
      get: async ({ params: parameters }) => {
        const relationships = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: relationships };
      },
      update: async ({ params: parameters, body: dto }) => {
        const relationships = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: relationships };
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
