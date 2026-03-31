import type { ComponentType } from "react";
import ROUTES from "../constants/routes";

// pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import VenuesPage from "../pages/VenuesPage";

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
  {
    path: ROUTES.LOGIN,
    component: Login,
  },
  {
    path: ROUTES.VenuesPage,
    component: VenuesPage,
  }
];

export default routes;
