import { VueWait } from "vue-wait";
import "pinia";

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "vue/types/vue" {
  interface Vue {
    $wait: VueWait;
  }
}
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    wait?: VueWait;
  }
}

declare module "pinia" {
  export interface PiniaCustomProperties {
    $wait: VueWait;
  }
}
