import { createRoute } from "@tanstack/react-router";
import { projectHomeRoute } from "../project/index.route";
import { SettingsPage } from "../../components/settings/settings-page";

export const settingsRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "/settings",

  component: SettingsPage,
});
