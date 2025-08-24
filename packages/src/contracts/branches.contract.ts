import { initContract } from "@ts-rest/core";
import z from "zod";
import { brancheSchema, createBrancheSchema, updateBrancheSchema } from "../dtos/branches.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const brancheContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new branche",
      description: "Create a new branche",
      body: createBrancheSchema,

      responses: {
        201: brancheSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all branches",
      description: "Get all branches",

      responses: {
        200: ListResultSchema(brancheSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one branche with her id",
      description: "Find one branche with her id",
      pathParams: idSchema,
      responses: {
        200: brancheSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update branche",
      description: "Update branche",
      pathParams: idSchema,
      body: updateBrancheSchema,
      responses: {
        200: brancheSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete branche",
      description: "Delete branche",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/branches",
  }
);
