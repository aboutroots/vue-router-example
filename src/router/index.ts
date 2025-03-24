import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import DashboardView from "@/views/DashboardView.vue";
import { RouteName } from "@/constants";

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

export default router;
