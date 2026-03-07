import { createRoute } from "@tanstack/react-router";
import { PlacesList } from "../../components/place/list-place";
import { projectHomeRoute } from "../project/index.route";

export const placeRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "place",

  component: PlacesList,
});
