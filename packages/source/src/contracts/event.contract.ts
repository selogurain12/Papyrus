import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  eventSchema,
  createEventSchema,
  updateEventSchema,
  filterEventSchema,
} from "../dtos/event.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
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
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: eventSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all events",
      description: "Get all events",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      query: filterEventSchema,

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
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
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
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      body: updateEventSchema,
      responses: {
        200: eventSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete event",
      description: "Soft delete event",
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      body: z.object({}),

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete event",
      description: "Delete event",
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:projectId/events",
  }
);
