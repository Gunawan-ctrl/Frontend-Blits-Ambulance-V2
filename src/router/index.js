import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { LocalStorage } from "quasar";

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.authAdmin)) {
      if (
        LocalStorage.getItem("dataUser") === null ||
        localStorage.getItem("dataUser") === "undefined"
      ) {
        next({
          name: "login",
        });
        // } else if (
        //   LocalStorage.getItem("dataUser") !== null ||
        //   localStorage.getItem("dataUser") !== "undefined"
        // ) {
        //   next({
        //     name: "dashboard",
        //   });
      } else {
        next();
      }
    } else {
      next();
    }
  });

  return Router;
});
