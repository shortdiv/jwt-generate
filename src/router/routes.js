import Dashboard from "../components/Dashboard";
import Protected from "../components/Protected";
import store from "../state/store";

export default [
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: {
      beforeResolve(to, from, next) {
        debugger;
        next();
      }
    },
    props: route => ({ redirected: route.params.redirectFrom })
  },
  {
    path: "/protected",
    name: "protected",
    component: Protected,
    meta: {
      beforeResolve: (to, from, next) => {
        if (store.getters["auth/hasToken"]) {
          next();
        } else {
          debugger;
          //redirect
          next({
            name: "dashboard",
            query: { redirectFrom: to.fullPath }
          });
        }
      }
    }
  }
];
