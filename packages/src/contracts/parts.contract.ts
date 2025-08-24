import { initContract } from "@ts-rest/core";
import z from "zod";
import { partSchema, createPartSchema, updatePartSchema } from "../dtos/parts.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const partContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new part",
      description: "Create a new part",
      body: createPartSchema,

      responses: {
        201: partSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all parts",
      description: "Get all parts",

      responses: {
        200: ListResultSchema(partSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one part with her id",
      description: "Find one part with her id",
      pathParams: idSchema,
      responses: {
        200: partSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update part",
      description: "Update part",
      pathParams: idSchema,
      body: updatePartSchema,
      responses: {
        200: partSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete part",
      description: "Delete part",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/parts",
  }
);
