import { initContract } from "@ts-rest/core";
import z from "zod";
import { placeSchema, createPlaceSchema, updatePlaceSchema } from "../dtos/places.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const placeContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new place",
      description: "Create a new place",
      body: createPlaceSchema,

      responses: {
        201: placeSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all places",
      description: "Get all places",

      responses: {
        200: ListResultSchema(placeSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one place with her id",
      description: "Find one place with her id",
      pathParams: idSchema,
      responses: {
        200: placeSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update place",
      description: "Update place",
      pathParams: idSchema,
      body: updatePlaceSchema,
      responses: {
        200: placeSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete place",
      description: "Delete place",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/places",
  }
);
