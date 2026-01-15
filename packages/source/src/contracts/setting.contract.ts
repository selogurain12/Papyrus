import { initContract } from "@ts-rest/core";
import { settingSchema, updateSettingSchema } from "../dtos/setting.dto";
import { idSchema } from "../dtos/id.dto";
import { errorSchema } from "../error";

const contrat = initContract();
export const settingContract = contrat.router(
  {
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
  },
  {
    pathPrefix: "/settings",
  }
);
