import { initContract } from "@ts-rest/core";
import z from "zod";
import { filterSchema } from "../dtos/filter.dto";
import { placeSchema, createPlaceSchema, updatePlaceSchema } from "../dtos/place.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const placeContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new place",
      description: "Create a new place",
      body: createPlaceSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: placeSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all places",
      description: "Get all places",
      query: filterSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        200: ListResultSchema(placeSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one place with her id",
      description: "Find one place with her id",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: placeSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update place",
      description: "Update place",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: updatePlaceSchema,
      responses: {
        200: placeSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete place",
      description: "Soft delete place",
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
      summary: "Delete place",
      description: "Delete place",
      pathParams: idSchema.extend({
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
    pathPrefix: "/places",
  }
);
