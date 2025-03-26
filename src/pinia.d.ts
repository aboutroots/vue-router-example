import { VueWait } from "vue-wait";
import VueRouter from "vue-router";
declare module "pinia" {
  export interface PiniaCustomProperties {
    $wait: VueWait;
    $router: VueRouter;
  }
}
