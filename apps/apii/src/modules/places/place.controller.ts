import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { placeContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { PlaceService } from "./place.service";

@Controller()
@UseGuards(AuthGuard)
export class PlaceController {
  private readonly service: PlaceService;

  public constructor(service: PlaceService) {
    this.service = service;
  }

  @TsRestHandler(placeContract)
  public handle() {
    return tsRestHandler(placeContract, {
      create: async ({ params: parameters, body: dto }) => {
        const places = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: places };
      },
      getAll: async ({ query, params: parameters }) => {
        const places = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: places };
      },
      get: async ({ params: parameters }) => {
        const places = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: places };
      },
      update: async ({ params: parameters, body: dto }) => {
        const places = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: places };
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
