import { createRoute } from "@tanstack/react-router";
import { DashboardPage } from "../../components/dashboard/dashboard-page";
import { projectHomeRoute } from "../project/index.route";

export const dashboardRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "/",

  component: DashboardPage,
});
