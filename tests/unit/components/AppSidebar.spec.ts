import { mount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import AppSidebar from "@/components/AppSidebar.vue";
import { RouteName } from "@/constants";

const toggleLock = jest.fn();
const setCollapsed = jest.fn();

// Mock the store
const mockUseSidebarStore = jest.fn().mockReturnValue({
  isCollapsed: false,
  isLocked: false,
  toggleLock,
  setCollapsed,
});

jest.mock("@/stores/sidebar", () => ({
  useSidebarStore: () => mockUseSidebarStore(),
}));

// Mock debounce to execute immediately
jest.mock("lodash/debounce", () => (fn: (...args: any[]) => any) => fn);

describe("AppSidebar.vue", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);

  const router = new VueRouter({
    routes: [
      {
        path: "/",
        name: RouteName.DASHBOARD,
        component: { template: "<div>Dashboard</div>" },
      },
      {
        path: "/about",
        name: RouteName.ABOUT,
        component: { template: "<div>About</div>" },
      },
    ],
  });

  const createWrapper = (options = {}) => {
    return mount(AppSidebar, {
      localVue,
      router,
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders sidebar with full width when not collapsed", () => {
      // Arrange
      const wrapper = createWrapper();

      // Assert
      expect(wrapper.classes()).toContain("w-64");
      expect(wrapper.classes()).not.toContain("w-16");
    });

    it("renders sidebar with collapsed width when collapsed", () => {
      // Arrange
      mockUseSidebarStore.mockReturnValueOnce({
        isCollapsed: true,
        isLocked: false,
        toggleLock,
        setCollapsed,
      });
      const wrapper = createWrapper();

      // Assert
      expect(wrapper.classes()).toContain("w-16");
      expect(wrapper.classes()).not.toContain("w-64");
    });

    it("renders all menu items", async () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      await wrapper.vm.$nextTick();
      const menuItems = wrapper.findAll('[data-test="nav-link"]');

      // Assert
      expect(menuItems).toHaveLength(2);
    });

    it("show lock button when opened", () => {
      // Arrange
      mockUseSidebarStore.mockReturnValueOnce({
        isCollapsed: false,
        isLocked: false,
        toggleLock,
        setCollapsed,
      });
      const wrapper = createWrapper();

      // Assert
      expect(wrapper.find('[data-test="lock-button"]').exists()).toBe(true);
    });

    it("hides lock button when collapsed", () => {
      // Arrange
      mockUseSidebarStore.mockReturnValueOnce({
        isCollapsed: true,
        isLocked: false,
        toggleLock,
        setCollapsed,
      });
      const wrapper = createWrapper();

      // Assert
      expect(wrapper.find('[data-test="lock-button"]').exists()).toBe(false);
    });
  });

  describe("interactions", () => {
    it("toggles lock when lock button is clicked", async () => {
      // Arrange
      const wrapper = createWrapper();
      const lockButton = wrapper.find('[data-test="lock-button"]');

      // Act
      await lockButton.trigger("click");

      // Assert
      expect(toggleLock).toHaveBeenCalled();
    });

    it("collapses sidebar on mouse leave when not locked", async () => {
      // Arrange
      mockUseSidebarStore.mockReturnValueOnce({
        isCollapsed: false,
        isLocked: false,
        toggleLock,
        setCollapsed,
      });
      const wrapper = createWrapper();

      // Act
      await wrapper.trigger("mouseleave");

      // Assert
      expect(setCollapsed).toHaveBeenCalledWith(true);
    });

    it("expands sidebar on mouse enter when collapsed and not locked", async () => {
      // Arrange
      mockUseSidebarStore.mockReturnValueOnce({
        isCollapsed: true,
        isLocked: false,
        toggleLock,
        setCollapsed,
      });
      const wrapper = createWrapper();

      // Act
      await wrapper.trigger("mouseenter");

      // Assert
      expect(setCollapsed).toHaveBeenCalledWith(false);
    });

    it.each([
      ["mouseleave", true],
      ["mouseleave", false],
      ["mouseenter", true],
      ["mouseenter", false],
    ])(
      "does not change state on %s when locked",
      async (event, isCollapsed) => {
        // Arrange
        mockUseSidebarStore.mockReturnValue({
          isCollapsed,
          isLocked: true,
          toggleLock,
          setCollapsed,
        });
        const wrapper = createWrapper();

        // Act
        await wrapper.trigger(event);

        // Assert
        expect(setCollapsed).not.toHaveBeenCalled();
      }
    );
  });

  describe("active route", () => {
    it("highlights correct route", async () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      await router.push({ name: RouteName.ABOUT });
      const dashboardLink1 = wrapper.findAll('[data-test="nav-link"]').at(0);
      const dashboardLink2 = wrapper.findAll('[data-test="nav-link"]').at(1);
      // Assert
      // Dashboard link should not be active
      expect(dashboardLink1.classes()).not.toContain("bg-gray-700");
      expect(dashboardLink1.classes()).not.toContain("text-white");
      expect(dashboardLink1.text().trim()).toContain("Dashboard");
      // About link should be active
      expect(dashboardLink2.classes()).toContain("bg-gray-700");
      expect(dashboardLink2.classes()).toContain("text-white");
      expect(dashboardLink2.text().trim()).toContain("About");
    });
  });
});
