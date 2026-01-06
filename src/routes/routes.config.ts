// src/routes/routes.config.ts

export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PRODUCT: (id: string) => `/product/${id}`,
};
