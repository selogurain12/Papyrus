import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  connectionSchema,
  createConnectionSchema,
  updateConnectionSchema,
} from "../dtos/connections.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const connectionContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new connection",
      description: "Create a new connection",
      body: createConnectionSchema,

      responses: {
        201: connectionSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all connections",
      description: "Get all connections",

      responses: {
        200: ListResultSchema(connectionSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one connection with her id",
      description: "Find one connection with her id",
      pathParams: idSchema,
      responses: {
        200: connectionSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update connection",
      description: "Update connection",
      pathParams: idSchema,
      body: updateConnectionSchema,
      responses: {
        200: connectionSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete connection",
      description: "Delete connection",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/connections",
  }
);
