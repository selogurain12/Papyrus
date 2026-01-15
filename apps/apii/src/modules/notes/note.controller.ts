import { Controller, UseGuards } from "@nestjs/common";
import { tsRestHandler, TsRestHandler } from "@ts-rest/nest";
import { noteContract } from "@papyrus/source";
import { AuthGuard } from "../authentification/authentification.guard";
import { NoteService } from "./note.service";

@Controller()
@UseGuards(AuthGuard)
export class NoteController {
  private readonly service: NoteService;

  public constructor(service: NoteService) {
    this.service = service;
  }

  @TsRestHandler(noteContract)
  public handle() {
    return tsRestHandler(noteContract, {
      create: async ({ params: parameters, body: dto }) => {
        const notes = await this.service.create(dto, parameters.projectId);
        return { status: 201, body: notes };
      },
      getAll: async ({ query, params: parameters }) => {
        const notes = await this.service.getAll(query, parameters.projectId);
        return { status: 200, body: notes };
      },
      get: async ({ params: parameters }) => {
        const notes = await this.service.get(parameters.id, parameters.projectId);
        return { status: 200, body: notes };
      },
      update: async ({ params: parameters, body: dto }) => {
        const notes = await this.service.update(parameters.id, dto, parameters.projectId);
        return { status: 200, body: notes };
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
