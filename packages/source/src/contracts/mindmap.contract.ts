import { initContract } from "@ts-rest/core";
import z from "zod";
import { filterSchema } from "../dtos/filter.dto";
import { errorSchema } from "../error";
import { mindMapSchema, createMindMapSchema, updateMindMapSchema } from "../dtos/mindmap.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";

const contrat = initContract();
export const mindmapContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new mindmap",
      description: "Create a new mindmap",
      body: createMindMapSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: mindMapSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all mindmaps",
      description: "Get all mindmaps",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      query: filterSchema,

      responses: {
        200: ListResultSchema(mindMapSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one mindmap with her id",
      description: "Find one mindmap with her id",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: mindMapSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update mindmap",
      description: "Update mindmap",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: updateMindMapSchema,
      responses: {
        200: mindMapSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete mindmap",
      description: "Soft delete mindmap",
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
      summary: "Delete mindmap",
      description: "Delete mindmap",
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
    pathPrefix: "/:projectId/mindmaps",
  }
);
