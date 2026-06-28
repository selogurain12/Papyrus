import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema } from "../error";
import { exportParams } from "../dtos/export.dto";

const contract = initContract();

export const exportContract = contract.router(
  {
    epub: {
      path: "/epub",
      method: "GET",
      summary: "Export project as an EPUB file",
      description: "Export project as an EPUB file",

      pathParams: z.object({
        userId: z.string().uuid(),
        projectId: z.string().uuid(),
      }),

      query: exportParams,

      responses: {
        200: z.unknown(),
        500: errorSchema,
      },
    },

    pdf: {
      path: "/pdf",
      method: "GET",
      summary: "Export project as a PDF file",
      description: "Export project as a PDF file",

      pathParams: z.object({
        userId: z.string().uuid(),
        projectId: z.string().uuid(),
      }),

      query: exportParams,

      responses: {
        200: z.unknown(),
        500: errorSchema,
      },
    },
    docx: {
      path: "/docx",
      method: "GET",
      summary: "Export project as a DOCX file",
      description: "Export project as a DOCX file",

      pathParams: z.object({
        userId: z.string().uuid(),
        projectId: z.string().uuid(),
      }),

      query: exportParams,

      responses: {
        200: z.unknown(),
        500: errorSchema,
      },
    },
    txt: {
      path: "/txt",
      method: "GET",
      summary: "Export project as a TXT file",
      description: "Export project as a TXT file",

      pathParams: z.object({
        userId: z.string().uuid(),
        projectId: z.string().uuid(),
      }),

      query: exportParams,

      responses: {
        200: z.unknown(),
        500: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/projects/:projectId/exports",
  }
);
