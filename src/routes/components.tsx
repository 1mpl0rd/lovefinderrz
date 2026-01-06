// src/routes/components.ts
import { lazy } from "react";
import { withSuspense } from "../utils/withSuspense";

// Layouts
import App from "../App";

// Pages
const Home = lazy(
  () => import(/* webpackChunkName: "page-home" */ "../pages/Home")
);
const Login = lazy(
  () => import(/* webpackChunkName: "page-login" */ "../pages/Login")
);
const Signup = lazy(
  () => import(/* webpackChunkName: "page-register" */ "../pages/Signup")
);

/*
  ! Non-lazy imports (for direct loading, e.g., SSR or testing)
  import App from "../App";
  import Home from "../pages/HomePage";
  import Login from "../pages/LoginPage";
  import Signup from "../pages/RegisterPage";
*/

export const AppLayout = <App />;
export const HomePage = withSuspense(Home, <></>);
export const LoginPage = withSuspense(Login, <></>);
export const SignupPage = withSuspense(Signup, <></>);

/*
  ! Non-Suspense wrapped exports (for direct rendering without fallback)
  export const AppLayoutRaw = App;
  export const HomePageRaw = Home;
  export const LoginPageRaw = Login;
  export const SignupPageRaw = Register;
*/
