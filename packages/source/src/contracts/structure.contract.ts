import { initContract } from "@ts-rest/core";
import z from "zod";
import { structureSchema, updateStructureSchema } from "../dtos/structure.dto";
import { idSchema } from "../dtos/id.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const structureContract = contrat.router(
  {
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one structure with her id",
      description: "Find one structure with her id",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: structureSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update structure",
      description: "Update structure",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: updateStructureSchema,
      responses: {
        200: structureSchema,
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:projectId/structure",
  }
);
