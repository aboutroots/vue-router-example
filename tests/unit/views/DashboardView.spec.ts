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

jest.mock("@/components/AccountSelector.vue", () => ({
  name: "AccountSelector",
  render: (h: CreateElement): VNode =>
    h(
      "div",
      { attrs: { "data-test": "account-selector-component" } },
      "Account Selector Component"
    ),
}));

jest.mock("@/components/ExpandableData.vue", () => ({
  name: "ExpandableData",
  render: (h: CreateElement): VNode =>
    h(
      "div",
      { attrs: { "data-test": "expandable-data-component" } },
      "Expandable Data Component"
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

  test("renders the AccountSelector component", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    expect(
      wrapper.find('[data-test="account-selector-component"]').exists()
    ).toBe(true);
    expect(
      wrapper.find('[data-test="account-selector-component"]').text()
    ).toBe("Account Selector Component");
  });

  test("renders the ExpandableData component", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    expect(
      wrapper.find('[data-test="expandable-data-component"]').exists()
    ).toBe(true);
    expect(wrapper.find('[data-test="expandable-data-component"]').text()).toBe(
      "Expandable Data Component"
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

    // Second column contains AccountSelector and ExpandableData
    expect(
      columns.at(1).find('[data-test="account-selector-component"]').exists()
    ).toBe(true);
    expect(
      columns.at(1).find('[data-test="expandable-data-component"]').exists()
    ).toBe(true);
  });
});
