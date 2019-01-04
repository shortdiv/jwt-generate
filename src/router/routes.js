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
        next();
      }
    },
    props: route => ({ redirected: route.params.redirectFrom })
  },
  {
    path: "/protected",
    name: "protected",
    component: Protected,
    meta: {},
    async beforeEnter(to, from, next) {
      //call axios//
      try {
        await store.dispatch("auth/getToken");
        if (store.getters["auth/hasToken"]) {
          next();
        }
      } catch (e) {
        //redirect
        next({
          name: "dashboard",
          query: { redirectFrom: to.fullPath }
        });
      }
    }
  }
];
