import { createRouter } from "@tanstack/react-router";
import { indexRoute } from "./index.routes";
import { defaultLayoutRoute } from "./layout.routes";
import { rootRoute } from "./root.routes";
import { queryClient } from "../context/query-client";
import { loginRoute, registerRoute } from "./authentification/index.route";
import { projectHomeRoute } from "./project/index.route";
import { characterRoute } from "./character/index.route";
import { placeRoute } from "./place/index.route";
import { objectRoute } from "./object/index.route";
import { researchRoute } from "./research/index.route";

export const routeTree = rootRoute.addChildren([
  defaultLayoutRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    projectHomeRoute.addChildren([characterRoute, placeRoute, objectRoute, researchRoute]),
  ]),
]);

export const router = createRouter({
  routeTree,
  context: queryClient,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
