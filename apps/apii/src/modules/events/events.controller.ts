import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { eventContract } from "@papyrus/source";
import { EventService } from "./events.service";

@Controller()
@UseGuards(AuthGuard)
export class EventController {
  private readonly service: EventService;

  public constructor(service: EventService) {
    this.service = service;
  }

  @TsRestHandler(eventContract)
  public handle() {
    return tsRestHandler(eventContract, {
      create: async ({ params: parameters, body: dto }) => {
        const event = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: event };
      },
      getAll: async ({ query, params: parameters }) => {
        const events = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: events };
      },
      get: async ({ params: parameters }) => {
        const event = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: event };
      },
      update: async ({ params: parameters, body: dto }) => {
        const event = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: event };
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
