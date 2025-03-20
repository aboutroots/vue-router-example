<template>
  <div class="flex items-center justify-center py-4">
    <div class="flex animate-spin">
      <svg class="h-8 w-8" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="#3B82F6"
          stroke-width="4"
          d="M12 2 L12 6 M12 18 L12 22 M4.93 4.93 L7.76 7.76 M16.24 16.24 L19.07 19.07 M2 12 L6 12 M18 12 L22
                    12"
        />
      </svg>
    </div>
    <span class="ml-3 text-gray-600">Loading...</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "LoadingSpinner",
});
</script>
