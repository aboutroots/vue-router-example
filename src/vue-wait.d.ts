import { VueWait } from "vue-wait";

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
