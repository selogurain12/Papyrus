import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema } from "../error";
import { neverDtoSchema } from "../dtos/delete-request.dto";

const contract = initContract();
export const exportContract = contract.router(
  {
    epub: {
      path: "/epub",
      method: "POST",
      summary: "Export project as an EPUB file",
      description: "Export project as an EPUB file",
      pathParams: z.object({
        userId: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      body: neverDtoSchema,

      responses: {
        200: z.object({
          url: z.string(),
        }),
        500: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/projects/:projectId/exports",
  }
);
