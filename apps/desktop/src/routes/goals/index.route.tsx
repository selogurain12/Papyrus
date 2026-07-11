import { createRoute } from "@tanstack/react-router";
import { projectHomeRoute } from "../project/index.route";
import { GoalPage } from "../../components/goals/goals-page";

export const goalsRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "goals",

  component: GoalPage,
});
