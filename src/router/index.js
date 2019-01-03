import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

const router = new Router({
  routes,
  mode: "history"
});

router.beforeResolve(async (to, from, next) => {
  try {
    for (const route of to.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(to, from, (...args) => {
            if (args.length) {
              next(...args);
              reject(new Error("Redirected"));
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
  } catch (err) {
    return;
  }
  next();
});

export default router;
