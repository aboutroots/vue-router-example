<template>
  <div id="app" class="font-sans antialiased text-gray-800">
    <Sidebar />
    <div class="ml-64 p-5 min-h-screen bg-gray-50">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Sidebar from "@/components/Sidebar.vue";

export default Vue.extend({
  name: "App",
  components: {
    Sidebar,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
