import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  architectureSchema,
  createArchitectureSchema,
  updateArchitectureSchema,
} from "../dtos/architecture.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";
import { filterSchema } from "../dtos/filter.dto";

const contrat = initContract();
export const architectureContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new architecture",
      description: "Create a new architecture",
      body: createArchitectureSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: architectureSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all architectures",
      description: "Get all architectures",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      query: filterSchema,

      responses: {
        200: ListResultSchema(architectureSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one architecture with her id",
      description: "Find one architecture with her id",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: architectureSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update architecture",
      description: "Update architecture",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: updateArchitectureSchema,
      responses: {
        200: architectureSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete architecture",
      description: "Delete architecture",
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
    pathPrefix: "/:projectId/architectures",
  }
);
