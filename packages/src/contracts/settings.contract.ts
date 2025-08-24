import { initContract } from "@ts-rest/core";
import z from "zod";
import { settingSchema, createSettingSchema, updateSettingSchema } from "../dtos/settings.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const settingContract = contrat.router(
  {
    create: {
      path: "/create",
      method: "POST",
      summary: "Create a new setting",
      description: "Create a new setting",
      body: createSettingSchema,

      responses: {
        201: settingSchema,
        409: errorSchema,
      },
    },
    getALL: {
      path: "",
      method: "GET",
      summary: "Get all settings",
      description: "Get all settings",

      responses: {
        200: ListResultSchema(settingSchema),
        404: errorSchema,
      },
    },
    get: {
      path: "/:id",
      method: "GET",
      summary: "Find one setting with her id",
      description: "Find one setting with her id",
      pathParams: idSchema,
      responses: {
        200: settingSchema,
        404: errorSchema,
      },
    },
    update: {
      path: "/update/:id",
      method: "PATCH",
      summary: "Update setting",
      description: "Update setting",
      pathParams: idSchema,
      body: updateSettingSchema,
      responses: {
        200: settingSchema,
        404: errorSchema,
      },
    },
    delete: {
      path: "/delete/:id",
      method: "DELETE",
      summary: "Delete setting",
      description: "Delete setting",
      pathParams: idSchema,
      body: neverDtoSchema,

      responses: {
        200: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/settings",
  }
);
