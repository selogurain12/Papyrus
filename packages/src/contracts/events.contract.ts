import { initContract } from "@ts-rest/core";
import z from "zod";
import { eventSchema, createEventSchema, updateEventSchema } from "../dtos/events.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const eventContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new event",
      description: "Create a new event",
      body: createEventSchema,

      responses: {
        201: eventSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all events",
      description: "Get all events",

      responses: {
        200: ListResultSchema(eventSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one event with her id",
      description: "Find one event with her id",
      pathParams: idSchema,
      responses: {
        200: eventSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update event",
      description: "Update event",
      pathParams: idSchema,
      body: updateEventSchema,
      responses: {
        200: eventSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete event",
      description: "Delete event",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/events",
  }
);
