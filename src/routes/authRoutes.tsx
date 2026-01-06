// src/routes/authRoutes.tsx
import { RouteObject } from "react-router-dom";
import { LoginPage, SignupPage } from "./components";

import { loginLoader } from "./loaders/authLoaders";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: LoginPage,
    loader: loginLoader,
  },
  {
    path: "signup",
    element: SignupPage,
  },
];
