import { createRoute } from "@tanstack/react-router";

import { DefaultLayout } from "../layout/default";

import { rootRoute } from "./root.routes";

export const defaultLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: DefaultLayout,
  id: "default-layout",
});
