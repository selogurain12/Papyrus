import { initContract } from "@ts-rest/core";
import { loginSchema, registerSchema, userSchema } from "../dtos/users.dto";
import { errorSchema } from "../error";

const contract = initContract();
export const authContract = contract.router(
  {
    createAccount: {
      path: "/create",
      method: "POST",
      summary: "Create an account",
      description: "Create an account",
      body: registerSchema,
      responses: {
        201: userSchema,
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
        201: userSchema,
        409: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/auth",
  }
);

