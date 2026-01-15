import { Controller, UseGuards } from "@nestjs/common";
import { characterContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { CharacterService } from "./characters.service";

@Controller()
@UseGuards(AuthGuard)
export class CharacterController {
  private readonly service: CharacterService;

  public constructor(service: CharacterService) {
    this.service = service;
  }

  @TsRestHandler(characterContract)
  public handle() {
    return tsRestHandler(characterContract, {
      create: async ({ params: parameters, body: dto }) => {
        const character = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: character };
      },
      getAll: async ({ query, params: parameters }) => {
        const characters = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: characters };
      },
      get: async ({ params: parameters }) => {
        const character = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: character };
      },
      update: async ({ params: parameters, body: dto }) => {
        const character = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: character };
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
