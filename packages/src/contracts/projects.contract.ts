import { initContract } from "@ts-rest/core";
import z from "zod";
import { projectSchema, createProjectSchema, updateProjectSchema } from "../dtos/projects.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const projectContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new project",
      description: "Create a new project",
      body: createProjectSchema,

      responses: {
        201: projectSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all projects",
      description: "Get all projects",

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
      pathParams: idSchema,
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
      pathParams: idSchema,
      body: updateProjectSchema,
      responses: {
        200: projectSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete project",
      description: "Delete project",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/projects",
  }
);
