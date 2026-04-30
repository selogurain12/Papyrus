import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { structureContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { StructureService } from "./structure.service";

@Controller()
@UseGuards(AuthGuard)
export class StructureController {
  private readonly service: StructureService;

  public constructor(service: StructureService) {
    this.service = service;
  }

  @TsRestHandler(structureContract)
  public handle() {
    return tsRestHandler(structureContract, {
      get: async ({ params: parameters }) => {
        const structure = await this.service.get(parameters.id);
        return { status: 200, body: structure };
      },
      update: async ({ params: parameters, body: dto }) => {
        const structure = await this.service.update(parameters.id, dto);
        return { status: 200, body: structure };
      },
    });
  }
}
