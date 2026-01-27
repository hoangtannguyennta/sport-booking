import type { ComponentType } from "react";
import ROUTES from "../constants/routes";

// pages
import Home from "../pages/Home";

export interface AppRoute {
  path: string;
  component: ComponentType;
  isPrivate?: boolean;
}

const routes: AppRoute[] = [
  {
    path: ROUTES.HOME,
    component: Home,
  },
];

export default routes;
