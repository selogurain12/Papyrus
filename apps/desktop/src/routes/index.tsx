import { createRouter } from "@tanstack/react-router";
import { indexRoute } from "./index.routes";
import { defaultLayoutRoute } from "./layout.routes";
import { rootRoute } from "./root.routes";
import { queryClient } from "../context/query-client";
import { loginRoute, registerRoute } from "./authentification/index.route";

export const routeTree = rootRoute.addChildren([
  defaultLayoutRoute.addChildren([indexRoute, loginRoute, registerRoute]),
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
