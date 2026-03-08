import { createRoute } from "@tanstack/react-router";
import { ObjectsList } from "../../components/object/list-object";
import { projectHomeRoute } from "../project/index.route";

export const objectRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "object",

  component: ObjectsList,
});
