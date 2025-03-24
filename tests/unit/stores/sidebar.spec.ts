import { setActivePinia, createPinia } from "pinia";
import { useSidebarStore } from "@/stores/sidebar";

describe("Sidebar Store", () => {
  let store: ReturnType<typeof useSidebarStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useSidebarStore();
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("should initialize with default values", () => {
      expect(store.isCollapsed).toBe(true);
      expect(store.isLocked).toBe(false);
    });
  });

  describe("toggleCollapse", () => {
    it("should toggle collapsed state", () => {
      expect(store.isCollapsed).toBe(true);
      store.toggleCollapse();
      expect(store.isCollapsed).toBe(false);
      store.toggleCollapse();
      expect(store.isCollapsed).toBe(true);
    });
  });

  describe("toggleLock", () => {
    it("should toggle locked state", () => {
      expect(store.isLocked).toBe(false);
      store.toggleLock();
      expect(store.isLocked).toBe(true);
      store.toggleLock();
      expect(store.isLocked).toBe(false);
    });
  });

  describe("setCollapsed", () => {
    it("should set collapsed state to true", () => {
      store.setCollapsed(true);
      expect(store.isCollapsed).toBe(true);
    });

    it("should set collapsed state to false", () => {
      store.setCollapsed(true); // First collapse it
      store.setCollapsed(false);
      expect(store.isCollapsed).toBe(false);
    });
  });
});
