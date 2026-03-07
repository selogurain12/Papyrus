import { createRoute } from "@tanstack/react-router";
import { defaultLayoutRoute } from "../layout.routes";
import { HomeProject } from "../../pages/home_project";

export const projectHomeRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/project/$name",

  component: HomeProject,
});
