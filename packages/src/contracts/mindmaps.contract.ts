import { initContract } from "@ts-rest/core";
import z from "zod";
import { errorSchema } from "../error";
import { mindMapSchema, createMindMapSchema, updateMindMapSchema } from "../dtos/mindmaps.dto";
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

      responses: {
        201: mindMapSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all mindmaps",
      description: "Get all mindmaps",

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
      pathParams: idSchema,
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
      pathParams: idSchema,
      body: updateMindMapSchema,
      responses: {
        200: mindMapSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete mindmap",
      description: "Delete mindmap",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/mindmaps",
  }
);
