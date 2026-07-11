import { Controller, UseGuards } from "@nestjs/common";
import { historyContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { HistoryService } from "./history.service";

@Controller()
@UseGuards(AuthGuard)
export class HistoryController {
  private readonly service: HistoryService;

  public constructor(service: HistoryService) {
    this.service = service;
  }

  @TsRestHandler(historyContract)
  public handle() {
    return tsRestHandler(historyContract, {
      getAll: async ({ params }) => {
        const history = await this.service.getAll(params.projectId);
        return { status: 200, body: history };
      },
      create: async ({ body, params }) => {
        const history = await this.service.create(body, params.projectId);
        return { status: 201, body: history };
      },
    });
  }
}
