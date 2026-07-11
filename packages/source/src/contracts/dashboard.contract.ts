import { initContract } from "@ts-rest/core";
import z from "zod";
import { dashboardSchema } from "../dtos/dashboard.dto";
import { errorSchema } from "../error";

const contract = initContract();

export const dashboardContract = contract.router(
  {
    get: {
      path: "",
      method: "GET",
      summary: "Get project dashboard data",
      description: "Get every computed value required by the project dashboard",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: dashboardSchema,
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:projectId/dashboard",
  }
);
