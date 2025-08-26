import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),

  layout("layouts/ProtectedLayout.tsx", [
    route("/dashboard", "./routes/Dashboard.tsx"),
  ]),

  layout("layouts/AuthLayout.tsx", [
    route("/login", "./routes/Auth/Login.tsx"),
    route("/signup", "./routes/Auth/Signup.tsx"),
  ]),

  route(
    "/.well-known/appspecific/com.chrome.devtools.json",
    "./routes/DebugNull.tsx"
  ),
] satisfies RouteConfig;
