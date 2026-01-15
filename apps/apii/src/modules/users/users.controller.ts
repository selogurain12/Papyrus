import { Controller, UseGuards } from "@nestjs/common";
import { userContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { AuthGuard } from "../authentification/authentification.guard";
import { UserService } from "./users.service";

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  private readonly service: UserService;

  public constructor(service: UserService) {
    this.service = service;
  }

  @TsRestHandler(userContract)
  public handle() {
    return tsRestHandler(userContract, {
      get: async ({ params: parameters }) => {
        const user = await this.service.get(parameters.id);
        return { status: 200, body: user };
      },
      update: async ({ params: parameters, body: dto }) => {
        const user = await this.service.update(parameters.id, dto);
        return { status: 200, body: user };
      },
      delete: async ({ params: parameters }) => {
        await this.service.delete(parameters.id);
        return { status: 200, body: undefined };
      },
    });
  }
}
