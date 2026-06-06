import { createRoute } from "@tanstack/react-router";
import { projectHomeRoute } from "../project/index.route";
import { PartsList } from "../../components/chapter/list-part";

export const chapterRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "chapter",

  component: PartsList,
});
