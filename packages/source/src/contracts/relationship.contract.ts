import { initContract } from "@ts-rest/core";
import z from "zod";
import { filterSchema } from "../dtos/filter.dto";
import {
  relationshipSchema,
  createRelationshipSchema,
  updateRelationshipSchema,
} from "../dtos/relationship.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const relationshipContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new relationship",
      description: "Create a new relationship",
      body: createRelationshipSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: relationshipSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all relationships",
      description: "Get all relationships",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      query: filterSchema,

      responses: {
        200: ListResultSchema(relationshipSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one relationship with her id",
      description: "Find one relationship with her id",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: relationshipSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update relationship",
      description: "Update relationship",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: updateRelationshipSchema,
      responses: {
        200: relationshipSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete relationship",
      description: "Soft delete relationship",
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
      summary: "Delete relationship",
      description: "Delete relationship",
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
    pathPrefix: "/:projectId/relationships",
  }
);
