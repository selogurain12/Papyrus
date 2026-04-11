import { createRoute } from "@tanstack/react-router";
import { projectHomeRoute } from "../project/index.route";
import { ListResearch } from "../../components/research/list-research";

export const researchRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "/research",

  component: ListResearch,
});
