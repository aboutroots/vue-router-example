<template>
  <div
    class="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 shadow-lg"
  >
    <div class="p-5 border-b border-gray-700">
      <h2 class="text-xl font-medium m-0">Demo</h2>
    </div>
    <nav class="py-5">
      <router-link
        :to="{ name: 'dashboard' }"
        class="flex items-center px-5 py-3 text-gray-100 no-underline transition-colors duration-200 hover:bg-gray-700"
        exact-active-class="bg-green-600 text-white"
      >
        <i class="fas fa-home w-5 text-center mr-3"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link
        :to="{ name: 'about' }"
        class="flex items-center px-5 py-3 text-gray-100 no-underline transition-colors duration-200 hover:bg-gray-700"
        exact-active-class="bg-green-600 text-white"
      >
        <i class="fas fa-info-circle w-5 text-center mr-3"></i>
        <span>About</span>
      </router-link>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AppSidebar",
});
</script>
