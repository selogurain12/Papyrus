import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { settingContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { SettingService } from "./settings.service";

@Controller()
@UseGuards(AuthGuard)
export class SettingController {
  private readonly service: SettingService;

  public constructor(service: SettingService) {
    this.service = service;
  }

  @TsRestHandler(settingContract)
  public handle() {
    return tsRestHandler(settingContract, {
      get: async ({ params: parameters }) => {
        const setting = await this.service.get(parameters.id);
        return { status: 200, body: setting };
      },
      update: async ({ params: parameters, body: dto }) => {
        const setting = await this.service.update(parameters.id, dto);
        return { status: 200, body: setting };
      },
    });
  }
}
