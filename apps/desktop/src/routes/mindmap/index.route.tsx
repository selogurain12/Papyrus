import { createRoute } from "@tanstack/react-router";
import { MindMapPage } from "../../components/mindmap/mindmap-list";
import { projectHomeRoute } from "../project/index.route";
import { CreateMindMap } from "../../components/mindmap/actions/create-mindmap";
import { MindMapViewer } from "../../components/mindmap/mindmap-viewer";
import { UpdateMindMap } from "../../components/mindmap/actions/update-mindmap";

export const mindmapRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "mindmap",

  component: MindMapPage,
});

export const createMindmapRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "mindmap/create",

  component: CreateMindMap,
});

export const viewMindmapRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "mindmap/$id/view",

  component: MindMapViewer,
});

export const updateMindmapRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "mindmap/update/$id",

  component: UpdateMindMap,
});