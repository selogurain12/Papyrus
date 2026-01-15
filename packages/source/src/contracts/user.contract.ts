import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { idSchema } from "../dtos/id.dto";
import { userSchema } from "../dtos/user.dto";
import { errorSchema } from "../error";

const contract = initContract();
export const userContract = contract.router(
  {
    get: {
      path: "/:id",
      method: "GET",
      summary: "Get user by ID",
      description: "Get user by ID",
      pathParams: idSchema,
      responses: {
        200: userSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update user by ID",
      description: "Update user by ID",
      pathParams: idSchema,
      body: userSchema,
      responses: {
        200: userSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete user by ID",
      description: "Delete user by ID",
      pathParams: idSchema,
      body: z.object({}),

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/user",
  }
);
