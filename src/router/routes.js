import Dashboard from "../components/Dashboard";
import Protected from "../components/Protected";

export default [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: {
      authRequired: true
    }
  },
  {
    path: "/protected",
    name: "protected",
    component: Protected
  }
];
