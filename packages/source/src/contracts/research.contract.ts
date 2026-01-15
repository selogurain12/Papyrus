import { initContract } from "@ts-rest/core";
import z from "zod";
import { filterSchema } from "../dtos/filter.dto";
import { researchSchema, createResearchSchema, updateResearchSchema } from "../dtos/research.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const researchContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new research",
      description: "Create a new research",
      body: createResearchSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: researchSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all researchs",
      description: "Get all researchs",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      query: filterSchema,

      responses: {
        200: ListResultSchema(researchSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one research with her id",
      description: "Find one research with her id",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: researchSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update research",
      description: "Update research",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: updateResearchSchema,
      responses: {
        200: researchSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete research",
      description: "Soft delete research",
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
      summary: "Delete research",
      description: "Delete research",
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
    pathPrefix: "/researchs",
  }
);
