import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { goalContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { GoalService } from "./goal.service";

@Controller()
@UseGuards(AuthGuard)
export class GoalController {
  private readonly service: GoalService;

  public constructor(service: GoalService) {
    this.service = service;
  }

  @TsRestHandler(goalContract)
  public handle() {
    return tsRestHandler(goalContract, {
      create: async ({ params: parameters, body: dto }) => {
        const goal = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: goal };
      },
      getAll: async ({ query, params: parameters }) => {
        const goals = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: goals };
      },
      get: async ({ params: parameters }) => {
        const goal = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: goal };
      },
      update: async ({ params: parameters, body: dto }) => {
        const goal = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: goal };
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
