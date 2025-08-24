import { initContract } from "@ts-rest/core";
import z from "zod";
import { researchSchema, createResearchSchema, updateResearchSchema } from "../dtos/researchs.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const researchContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new research",
      description: "Create a new research",
      body: createResearchSchema,

      responses: {
        201: researchSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all researchs",
      description: "Get all researchs",

      responses: {
        200: ListResultSchema(researchSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one research with her id",
      description: "Find one research with her id",
      pathParams: idSchema,
      responses: {
        200: researchSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update research",
      description: "Update research",
      pathParams: idSchema,
      body: updateResearchSchema,
      responses: {
        200: researchSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete research",
      description: "Delete research",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/researchs",
  }
);
