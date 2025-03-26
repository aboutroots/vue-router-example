<template>
  <div id="app">
    <AppLayout />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppLayout from "@/components/AppLayout.vue";

export default Vue.extend({
  name: "App",
  components: {
    AppLayout,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
}
</style>
