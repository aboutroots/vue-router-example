import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import DashboardView from "@/views/DashboardView.vue";
import { RouteName } from "@/constants";
import { queryParamSynchronizer } from "@/services/QueryParamSynchronizer";
import { queryReader } from "@/services/QueryReader";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: RouteName.DASHBOARD,
    component: DashboardView,
  },
  {
    path: "/about",
    name: RouteName.ABOUT,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Navigation guard to synchronize query parameters with store state
router.beforeEach(async (to, from, next) => {
  // Only process if query parameters exist and have changed
  const hasQueryParams = queryReader.routeHasQueryParams(to);
  if (hasQueryParams && to.query !== from.query) {
    // Process the query parameters with option to normalize and update URL if needed
    await queryParamSynchronizer.processQueryParams(to, { updateUrl: true });
  }
  next();
});

export default router;
