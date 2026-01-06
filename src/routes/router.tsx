// src/routes/router.tsx
import {
  createHashRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";

import { authRoutes } from "./authRoutes";
import { AppLayout, HomePage } from "./components";

const routes: RouteObject[] = [
  {
    path: "/",
    element: AppLayout,
    children: [
      {
        index: true,
        element: HomePage,
      },
      ...authRoutes,
    ],
  },
];

const router = createHashRouter(routes);

// Use for Tests/Storybook
export const Router = () => <RouterProvider router={router} />;
