import type VueRouter from "vue-router";
import VueWait from "vue-wait";

declare module "pinia" {
  export interface PiniaCustomProperties {
    $wait: VueWait;
    $router: VueRouter;
  }
}
