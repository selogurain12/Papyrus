import { Controller, UseGuards } from "@nestjs/common";
import { dashboardContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { DashboardService } from "./dashboard.service";

@Controller()
@UseGuards(AuthGuard)
export class DashboardController {
  private readonly service: DashboardService;

  public constructor(service: DashboardService) {
    this.service = service;
  }

  @TsRestHandler(dashboardContract)
  public handle() {
    return tsRestHandler(dashboardContract, {
      get: async ({ params }) => {
        const dashboard = await this.service.get(params.projectId);
        return { status: 200, body: dashboard };
      },
    });
  }
}
