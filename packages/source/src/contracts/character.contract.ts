import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  characterSchema,
  createCharacterSchema,
  filterCharacterSchema,
  updateCharacterSchema,
} from "../dtos/character.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
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
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      body: createCharacterSchema,

      responses: {
        201: characterSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all characters",
      description: "Get all characters",
      query: filterCharacterSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

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
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
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
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      body: updateCharacterSchema,
      responses: {
        200: characterSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete character",
      description: "Soft delete character",
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
      summary: "Delete character",
      description: "Delete character",
      pathParams: z.object({
        id: z.string().uuid(),
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
    pathPrefix: "/:projectId/characters",
  }
);
