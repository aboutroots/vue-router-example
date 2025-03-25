<template>
  <div class="flex h-screen">
    <AppSidebar />
    <ModalsContainer />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <v-wait :for="WAIT_KEY">
          <template slot="waiting">
            <loading-spinner />
          </template>
          <router-view />
        </v-wait>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppSidebar from "./AppSidebar.vue";
import { WaitKey } from "@/constants";
import LoadingSpinner from "./LoadingSpinner.vue";
import ModalsContainer from "./ModalsContainer.vue";

export default Vue.extend({
  name: "AppLayout",
  components: {
    AppSidebar,
    LoadingSpinner,
    ModalsContainer,
  },

  computed: {
    WAIT_KEY() {
      return WaitKey.FETCH_CONFIG;
    },
  },
});
</script>
