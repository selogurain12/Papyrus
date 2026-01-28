import { createRoute } from "@tanstack/react-router";
import { Login } from "../../components/authentification/login";
import { defaultLayoutRoute } from "../layout.routes";
import { Register } from "../../components/authentification/register";

export const loginRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/login",

  component: Login,
});

export const registerRoute = createRoute({
  getParentRoute: () => defaultLayoutRoute,
  path: "/register",

  component: Register,
});
