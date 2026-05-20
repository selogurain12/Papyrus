import { Controller, UseGuards } from "@nestjs/common";

import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";

import { exportContract } from "@papyrus/source";

import { AuthGuard } from "../authentification/authentification.guard";

import { ExportService } from "./export.service";

@Controller()
@UseGuards(AuthGuard)
export class ExportController {
  public constructor(private readonly service: ExportService) {}

  @TsRestHandler(exportContract)
  public handle() {
    return tsRestHandler(exportContract, {
      epub: async ({ params: parameters }) => {
        const epub = await this.service.exportEpub(parameters.projectId, parameters.userId);

        return {
          status: 200,
          body: epub,
        };
      },
    });
  }
}
