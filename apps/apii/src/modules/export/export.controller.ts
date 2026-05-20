import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { exportContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";

@Controller()
@UseGuards(AuthGuard)
export class ExportController {
  private readonly service: ExportService;

  public constructor(service: ExportService) {
    this.service = service;
  }

  @TsRestHandler(exportContract)
  public handle() {
    return tsRestHandler(exportContract, {
      epub: async ({ params: parameters }) => {
        const epub = await this.service.exportEpub(parameters.projectId, parameters.userId);
        return { status: 200, body: epub };
      },
    });
  }
}
