import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  architectureSchema,
  createArchitectureSchema,
  updateArchitectureSchema,
} from "../dtos/architectures.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const architectureContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new architecture",
      description: "Create a new architecture",
      body: createArchitectureSchema,

      responses: {
        201: architectureSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all architectures",
      description: "Get all architectures",

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
      pathParams: idSchema,
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
      pathParams: idSchema,
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
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/architectures",
  }
);
