import { createRoute } from "@tanstack/react-router";
import { projectHomeRoute } from "../project/index.route";
import { ExportPage } from "../../components/export/export-page";

export const exportRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "export",

  component: ExportPage,
});
