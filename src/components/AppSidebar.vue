<template>
  <aside
    class="bg-gray-800 text-white transition-all duration-300 flex-shrink-0"
    :class="{ 'w-16': isCollapsed, 'w-64': !isCollapsed }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="p-4 flex items-center justify-between">
      <h1 v-if="!isCollapsed" class="text-xl font-bold">Dashboard</h1>
      <div class="flex space-x-2">
        <button
          v-if="!isCollapsed"
          @click="toggleLock"
          class="p-2 rounded transition-colors duration-200 active:bg-gray-700"
          :class="{ 'bg-gray-700': isLocked }"
          data-test="lock-button"
        >
          <i class="fas" :class="isLocked ? 'fa-lock' : 'fa-lock-open'"></i>
        </button>
        <div
          v-else
          class="p-2 rounded transition-colors duration-200 active:bg-gray-700"
        >
          <i class="fas fa-bars"></i>
        </div>
      </div>
    </div>

    <nav class="mt-4">
      <router-link
        v-for="item in menuItemsWithState"
        :key="item.name"
        :to="{ name: item.name }"
        class="flex items-center px-4 py-3 text-gray-300 transition-colors duration-200"
        :class="{
          'justify-center': isCollapsed,
          'bg-gray-700 text-white': item.isActive,
        }"
        :title="isCollapsed ? item.label : ''"
        data-test="nav-link"
      >
        <i :class="item.icon" class="w-6"></i>
        <span v-if="!isCollapsed" class="ml-3">
          {{ item.label }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "pinia";
import { useSidebarStore } from "@/stores/sidebar";
import { RouteName } from "@/constants";
import debounce from "lodash/debounce";

interface MenuItem {
  name: RouteName;
  label: string;
  icon: string;
}

interface MenuItemWithState extends MenuItem {
  isActive: boolean;
}

const SETTLE_DELAY = 200;

export default Vue.extend({
  name: "AppSidebar",

  data() {
    return {
      lastEventType: null as "enter" | "leave" | null,
    };
  },

  computed: {
    ...mapState(useSidebarStore, ["isCollapsed", "isLocked"]),

    baseMenuItems(): MenuItem[] {
      return [
        {
          name: RouteName.DASHBOARD,
          label: "Dashboard",
          icon: "fas fa-home",
        },
        {
          name: RouteName.ABOUT,
          label: "About",
          icon: "fas fa-info-circle",
        },
      ];
    },

    menuItemsWithState(): MenuItemWithState[] {
      return this.baseMenuItems.map((item) => ({
        ...item,
        isActive: this.isRouteActive(item.name),
      }));
    },
  },

  methods: {
    ...mapActions(useSidebarStore, ["toggleLock", "setCollapsed"]),

    isRouteActive(routeName: RouteName): boolean {
      return this.$route.name === routeName;
    },

    // Debounced handler that waits for events to settle
    handleStateChange: debounce(function (this: any) {
      if (this.isLocked) return;

      if (this.lastEventType === "leave" && !this.isCollapsed) {
        this.setCollapsed(true);
      } else if (this.lastEventType === "enter" && this.isCollapsed) {
        this.setCollapsed(false);
      }
    }, SETTLE_DELAY),

    handleMouseEnter() {
      this.lastEventType = "enter";
      this.handleStateChange();
    },

    handleMouseLeave() {
      this.lastEventType = "leave";
      this.handleStateChange();
    },
  },

  beforeDestroy() {
    // Clean up the debounced function
    if (this.handleStateChange.cancel) {
      this.handleStateChange.cancel();
    }
  },
});
</script>
