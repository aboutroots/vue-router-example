<template>
  <div class="flex h-screen">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppSidebar from "./AppSidebar.vue";

export default Vue.extend({
  name: "AppLayout",
  components: {
    AppSidebar,
  },
});
</script>
