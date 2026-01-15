import { authContract } from "@papyrus/source";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { Controller } from "@nestjs/common";
import { AuthificationService } from "./authentification.service";

@Controller()
export class AuthentificationController {
  private readonly service: AuthificationService;
  public constructor(service: AuthificationService) {
    this.service = service;
  }

  @TsRestHandler(authContract)
  public handle() {
    return tsRestHandler(authContract, {
      login: async ({ body: dto }) => {
        const token = await this.service.login(dto);
        return { status: 200, body: token };
      },
      register: async ({ body: dto }) => {
        const user = await this.service.register(dto);
        return { status: 201, body: user };
      },
    });
  }
}
