<template>
  <div class="flex gap-6">
    <!-- Main dashboard content - flex-1 for equal width -->
    <div class="flex-1">
      <DashboardPanel />
    </div>

    <!-- Right side items - also flex-1 for equal width -->
    <div class="flex-1 flex flex-col gap-6">
      <AccountSelector />
      <ExpandableData />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DashboardPanel from "@/components/Dashboard.vue";
import AccountSelector from "@/components/AccountSelector.vue";
import ExpandableData from "@/components/ExpandableData.vue";

export default Vue.extend({
  name: "DashboardView",

  components: {
    DashboardPanel,
    AccountSelector,
    ExpandableData,
  },
});
</script>
