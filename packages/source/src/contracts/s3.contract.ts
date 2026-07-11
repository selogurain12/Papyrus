import { initContract } from "@ts-rest/core";
import z from "zod";
import { errorSchema } from "../error";

const contract = initContract();
export const s3Contract = contract.router(
  {
    upload: {
      path: "/upload",
      method: "POST",
      summary: "Upload a file to S3",
      description: "Upload a file to S3",
      contentType: "multipart/form-data",
      body: z.object({
        file: z.instanceof(File),
      }),
      responses: {
        200: z.object({
          url: z.string(),
        }),
        500: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/s3",
  }
);
