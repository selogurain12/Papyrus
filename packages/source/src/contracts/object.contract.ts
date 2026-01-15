import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  objectSchema,
  createObjectSchema,
  updateObjectSchema,
  filterObjectSchema,
} from "../dtos/object.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const objectContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new object",
      description: "Create a new object",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      body: createObjectSchema,

      responses: {
        201: objectSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all objects",
      description: "Get all objects",
      query: filterObjectSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        200: ListResultSchema(objectSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one object with her id",
      description: "Find one object with her id",
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      responses: {
        200: objectSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update object",
      description: "Update object",
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      body: updateObjectSchema,
      responses: {
        200: objectSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete object",
      description: "Soft delete object",
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
      summary: "Delete object",
      description: "Delete object",
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
    pathPrefix: "/:projectId/objects",
  }
);
