import { createRoute } from "@tanstack/react-router";
import { projectHomeRoute } from "../project/index.route";
import { NotesList } from "../../components/notes/list-notes";

export const noteRoute = createRoute({
  getParentRoute: () => projectHomeRoute,
  path: "note",

  component: NotesList,
});
