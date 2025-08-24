import { initContract } from "@ts-rest/core";
import z from "zod";
import { chapterSchema, createChapterSchema, updateChapterSchema } from "../dtos/chapters.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const chapterContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new chapter",
      description: "Create a new chapter",
      body: createChapterSchema,

      responses: {
        201: chapterSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all chapters",
      description: "Get all chapters",

      responses: {
        200: ListResultSchema(chapterSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one chapter with her id",
      description: "Find one chapter with her id",
      pathParams: idSchema,
      responses: {
        200: chapterSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update chapter",
      description: "Update chapter",
      pathParams: idSchema,
      body: updateChapterSchema,
      responses: {
        200: chapterSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete chapter",
      description: "Delete chapter",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/chapters",
  }
);
