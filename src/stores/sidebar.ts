import { defineStore } from "pinia";

interface SidebarState {
  isCollapsed: boolean;
  isLocked: boolean;
}

export const useSidebarStore = defineStore("sidebar", {
  state: (): SidebarState => ({
    isCollapsed: true,
    isLocked: false,
  }),

  actions: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },

    toggleLock() {
      this.isLocked = !this.isLocked;
    },

    setCollapsed(value: boolean) {
      this.isCollapsed = value;
    },
  },
});
