import { createRoute } from "@tanstack/react-router";
import { MindMapPage } from "../../components/mindmap/mindmap-list";
import { projectHomeRoute } from "../project/index.route";

export const mindmapRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "mindmap",

  component: MindMapPage,
});
