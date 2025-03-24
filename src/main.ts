import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { createPinia, PiniaVuePlugin } from "pinia";
import VueCompositionAPI from "@vue/composition-api";
import VueWait from "vue-wait";
import "./assets/tailwind.css";

const wait = new VueWait();
const pinia = createPinia();

Vue.use(VueCompositionAPI);
Vue.use(PiniaVuePlugin);
Vue.use(VueWait);

// Add vue-wait to all stores
pinia.use(({ store }) => {
  store.$wait = wait;
});

Vue.config.productionTip = false;

new Vue({
  router,
  pinia,
  wait,
  render: (h) => h(App),
}).$mount("#app");
