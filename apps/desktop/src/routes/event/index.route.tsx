import { createRoute } from "@tanstack/react-router";
import { EventsList } from "../../components/event/list-event";
import { projectHomeRoute } from "../project/index.route";

export const eventRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "event",

  component: EventsList,
});
