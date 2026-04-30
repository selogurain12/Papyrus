import { createRoute } from "@tanstack/react-router";
import { projectHomeRoute } from "../project/index.route";
import { StructurePage } from "../../components/structure/structure";

export const structureRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "/structure",

  component: StructurePage,
});
