<template>
  <div class="flex gap-6">
    <!-- Main dashboard content - flex-1 for equal width -->
    <div class="flex-1">
      <DashboardPanel />
    </div>

    <!-- Right side items - also flex-1 for equal width -->
    <div class="flex-1 flex flex-col gap-6">
      <ControlPanel />
      <FavoriteUsers />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DashboardPanel from "@/components/Dashboard.vue";
import ControlPanel from "@/components/ControlPanel.vue";
import FavoriteUsers from "@/components/FavoriteUsers.vue";

export default Vue.extend({
  name: "DashboardView",

  components: {
    DashboardPanel,
    ControlPanel,
    FavoriteUsers,
  },
});
</script>
