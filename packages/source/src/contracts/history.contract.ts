import { initContract } from "@ts-rest/core";
import z from "zod";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";
import { createHistorySchema, historySchema } from "../dtos/history.dto";

const contract = initContract();
export const historyContract = contract.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new history entry",
      description: "Create a new history entry",
      body: createHistorySchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: historySchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all history entries",
      description: "Get all history entries",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        200: ListResultSchema(historySchema),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:projectId/history",
  }
);
