import { initContract } from "@ts-rest/core";
import z from "zod";
import { noteSchema, createNoteSchema, updateNoteSchema } from "../dtos/notes.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const noteContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new note",
      description: "Create a new note",
      body: createNoteSchema,

      responses: {
        201: noteSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all notes",
      description: "Get all notes",

      responses: {
        200: ListResultSchema(noteSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one note with her id",
      description: "Find one note with her id",
      pathParams: idSchema,
      responses: {
        200: noteSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update note",
      description: "Update note",
      pathParams: idSchema,
      body: updateNoteSchema,
      responses: {
        200: noteSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete note",
      description: "Delete note",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/notes",
  }
);
