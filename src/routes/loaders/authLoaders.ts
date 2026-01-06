// src/routes/loaders/authLoaders.ts

import { redirect } from "react-router-dom";
import { ROUTES } from "../routes.config";

export async function loginLoader() {
  const isAuthenticated = localStorage.getItem("auth_token") !== null;

  if (isAuthenticated) {
    return redirect(ROUTES.ROOT);
  }

  return null;
}
