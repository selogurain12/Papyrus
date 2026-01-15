import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  projectSchema,
  createProjectSchema,
  updateProjectSchema,
  filterProjectSchema,
} from "../dtos/project.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contract = initContract();
export const projectContract = contract.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new project",
      description: "Create a new project",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      body: createProjectSchema,

      responses: {
        201: projectSchema,
        409: errorSchema,
      },
    },
    getAll: {
      path: "",
      method: "GET",
      summary: "Get all projects",
      description: "Get all projects",
      query: filterProjectSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),

      responses: {
        200: ListResultSchema(projectSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one project with her id",
      description: "Find one project with her id",
      pathParams: z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
      }),
      responses: {
        200: projectSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update project",
      description: "Update project",
      pathParams: z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
      }),
      body: updateProjectSchema,
      responses: {
        200: projectSchema,
        404: errorSchema,
      },
    },
    softDelete: {
      path: "/softDelete/:id",
      method: "DELETE",
      summary: "Soft delete project",
      description: "Soft delete project",
      pathParams: z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
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
      summary: "Delete project",
      description: "Delete project",
      pathParams: z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
      }),
      body: z.object({}),

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/projects",
  }
);
