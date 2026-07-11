import { initContract } from "@ts-rest/core";
import z from "zod";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { createGoalSchema, filterGoalSchema, goalSchema, updateGoalSchema } from "../dtos/goal.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contract = initContract();
export const goalContract = contract.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new goal",
      description: "Create a new goal",
      body: createGoalSchema,
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),

      responses: {
        201: goalSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all goals",
      description: "Get all goals",
      pathParams: z.object({
        projectId: z.string().uuid(),
      }),
      query: filterGoalSchema,

      responses: {
        200: ListResultSchema(goalSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one goal with her id",
      description: "Find one goal with her id",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      responses: {
        200: goalSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update goal",
      description: "Update goal",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: updateGoalSchema,
      responses: {
        200: goalSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete goal",
      description: "Soft delete goal",
      pathParams: z.object({
        id: z.string().uuid(),
        projectId: z.string().uuid(),
      }),
      body: z.object({}),

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete goal",
      description: "Delete goal",
      pathParams: idSchema.extend({
        projectId: z.string().uuid(),
      }),
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:projectId/goals",
  }
);
