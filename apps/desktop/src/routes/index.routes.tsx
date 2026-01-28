import { createRoute } from "@tanstack/react-router";

import { defaultLayoutRoute } from "./layout.routes";
import { ProjectPage } from "../pages/project";

export const indexRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/",

  component: ProjectPage,
});
