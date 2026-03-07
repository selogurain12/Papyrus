import { createRoute } from "@tanstack/react-router";
import { CharactersList } from "../../components/character/list-character";
import { projectHomeRoute } from "../project/index.route";

export const characterRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "character",

  component: CharactersList,
});
