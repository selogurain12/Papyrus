import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  characterSchema,
  createCharacterSchema,
  updateCharacterSchema,
} from "../dtos/characters.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const characterContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new character",
      description: "Create a new character",
      body: createCharacterSchema,

      responses: {
        201: characterSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all characters",
      description: "Get all characters",

      responses: {
        200: ListResultSchema(characterSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one character with her id",
      description: "Find one character with her id",
      pathParams: idSchema,
      responses: {
        200: characterSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update character",
      description: "Update character",
      pathParams: idSchema,
      body: updateCharacterSchema,
      responses: {
        200: characterSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete character",
      description: "Delete character",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/characters",
  }
);
