import { createHashHistory, createRouter } from "@tanstack/react-router";
import { queryClient } from "../context/query-client";
import { indexRoute } from "./index.routes";
import { defaultLayoutRoute } from "./layout.routes";
import { rootRoute } from "./root.routes";
import { loginRoute, registerRoute } from "./authentification/index.route";
import { projectHomeRoute } from "./project/index.route";
import { characterRoute } from "./character/index.route";
import { placeRoute } from "./place/index.route";
import { objectRoute } from "./object/index.route";
import { researchRoute } from "./research/index.route";
import { eventRoute } from "./event/index.route";
import { noteRoute } from "./note/index.route";
import { structureRoute } from "./structure/index.routes";
import {
  createMindmapRoute,
  mindmapRoute,
  updateMindmapRoute,
  viewMindmapRoute,
} from "./mindmap/index.route";
import { chapterRoute } from "./chapter/index.route";
import { exportRoute } from "./export/index.route";
import { settingsRoute } from "./settings/index.route";
import { dashboardRoute } from "./dashboard/index.route";
import { goalsRoute } from "./goals/index.route";

export const routeTree = rootRoute.addChildren([
  defaultLayoutRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    projectHomeRoute.addChildren([
      dashboardRoute,
      characterRoute,
      placeRoute,
      objectRoute,
      researchRoute,
      eventRoute,
      noteRoute,
      structureRoute,
      mindmapRoute,
      createMindmapRoute,
      updateMindmapRoute,
      viewMindmapRoute,
      chapterRoute,
      exportRoute,
      settingsRoute,
      goalsRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,
  context: queryClient,
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
