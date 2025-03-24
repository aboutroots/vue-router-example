import { mount } from "@vue/test-utils";
import DashboardView from "@/views/DashboardView.vue";
import { CreateElement, VNode } from "vue";

// Mock components
jest.mock("@/components/Dashboard.vue", () => ({
  name: "DashboardPanel",
  render: (h: CreateElement): VNode =>
    h(
      "div",
      { attrs: { "data-test": "dashboard-component" } },
      "Dashboard Component"
    ),
}));

jest.mock("@/components/ControlPanel.vue", () => ({
  name: "ControlPanel",
  render: (h: CreateElement): VNode =>
    h(
      "div",
      { attrs: { "data-test": "control-panel-component" } },
      "Control Panel Component"
    ),
}));

jest.mock("@/components/FavoriteUsers.vue", () => ({
  name: "FavoriteUsers",
  render: (h: CreateElement): VNode =>
    h(
      "div",
      { attrs: { "data-test": "favorite-users-component" } },
      "Favorite Users Component"
    ),
}));

describe("DashboardView", () => {
  // Helper function to create the component
  const createWrapper = () => {
    return mount(DashboardView);
  };

  test("renders the Dashboard component", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    expect(wrapper.find('[data-test="dashboard-component"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[data-test="dashboard-component"]').text()).toBe(
      "Dashboard Component"
    );
  });

  test("renders the ControlPanel component", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    expect(wrapper.find('[data-test="control-panel-component"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[data-test="control-panel-component"]').text()).toBe(
      "Control Panel Component"
    );
  });

  test("renders the FavoriteUsers component", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    expect(
      wrapper.find('[data-test="favorite-users-component"]').exists()
    ).toBe(true);
    expect(wrapper.find('[data-test="favorite-users-component"]').text()).toBe(
      "Favorite Users Component"
    );
  });

  test("has the correct layout structure", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    // Check for flex layout container
    expect(wrapper.find(".flex.gap-6").exists()).toBe(true);

    // Check for two main columns with flex-1
    const columns = wrapper.findAll(".flex-1");
    expect(columns.length).toBe(2);

    // First column contains Dashboard
    expect(
      columns.at(0).find('[data-test="dashboard-component"]').exists()
    ).toBe(true);

    // Second column contains ControlPanel and FavoriteUsers
    expect(
      columns.at(1).find('[data-test="control-panel-component"]').exists()
    ).toBe(true);
    expect(
      columns.at(1).find('[data-test="favorite-users-component"]').exists()
    ).toBe(true);
  });
});
