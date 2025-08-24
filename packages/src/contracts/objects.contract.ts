import { initContract } from "@ts-rest/core";
import z from "zod";
import { objectSchema, createObjectSchema, updateObjectSchema } from "../dtos/objects.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
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
      body: createObjectSchema,

      responses: {
        201: objectSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all objects",
      description: "Get all objects",

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
      pathParams: idSchema,
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
      pathParams: idSchema,
      body: updateObjectSchema,
      responses: {
        200: objectSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete object",
      description: "Delete object",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/objects",
  }
);
