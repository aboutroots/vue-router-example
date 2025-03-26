import VueRouter, { RouteConfig } from "vue-router";
import DashboardView from "@/views/DashboardView.vue";
import { RouteName } from "@/constants";
import { queryParamSynchronizer } from "@/services/QueryParamSynchronizer";
import { queryReader } from "@/services/QueryReader";
import { useConfigStore } from "@/stores/config";
import initializeApp from "@/services/initialize";

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
  console.log("navigation!", to.query);

  // 1. If the app config is not loaded, we need to load it. This is the first
  // thing we need to do because it can be required for other services to work.
  const configStore = useConfigStore();
  if (!configStore.isLoaded) {
    await configStore.loadConfig();
  }

  // 2. Only process query parameters if they exist and have changed
  // (this is also true for the first load).
  const hasQueryParams = queryReader.routeHasQueryParams(to);
  if (hasQueryParams && to.query !== from.query) {
    // Process the query parameters with option to normalize and update URL if needed
    await queryParamSynchronizer.processQueryParams(to, { updateUrl: true });
  }

  next();
});

// Initialize the app if it's not initialized. The reason we do this in afterEach
// is because we want to ensure the router params are set before the app is initialized.
router.afterEach(async (to) => {
  // 3. Initialize the app with default values if it's not initialized
  const configStore = useConfigStore();
  if (configStore.isLoaded && !configStore.isAppInitialized) {
    await initializeApp();
    configStore.markAsInitialized();
  }
});

export default router;
