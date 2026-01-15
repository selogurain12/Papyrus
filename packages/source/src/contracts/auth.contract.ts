import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { loginSchema, registerSchema, userSchema } from "../dtos/user.dto";
import { errorSchema } from "../error";

const contract = initContract();
export const authContract = contract.router(
  {
    register: {
      path: "/register",
      method: "POST",
      summary: "Create an account",
      description: "Create an account",
      body: registerSchema,
      responses: {
        201: z.object({
          token: z.string(),
          user: userSchema,
        }),
        409: errorSchema,
      },
    },
    login: {
      path: "/login",
      method: "POST",
      summary: "Login to account",
      description: "Login to account",
      body: loginSchema,
      responses: {
        201: z.object({
          token: z.string(),
          user: userSchema,
        }),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/auth",
  }
);
