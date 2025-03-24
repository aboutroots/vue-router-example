import { mount } from "@vue/test-utils";
import ControlPanel from "@/components/ControlPanel.vue";

const setAccount = jest.fn();
const setMode = jest.fn();

// Mock account store
const mockUseAccountStore = jest.fn().mockReturnValue({
  currentAccount: null,
  setAccount,
});

// Mock config store
const mockUseConfigStore = jest.fn().mockReturnValue({
  possibleAccounts: [
    { id: "account1", name: "Account 1" },
    { id: "account2", name: "Account 2" },
    { id: "account3", name: "Account 3" },
  ],
});

// Mock specialMode store
const mockUseSpecialModeStore = jest.fn().mockReturnValue({
  mode: null,
  setMode,
});

jest.mock("@/stores/account", () => ({
  useAccountStore: () => mockUseAccountStore(),
}));

jest.mock("@/stores/config", () => ({
  useConfigStore: () => mockUseConfigStore(),
}));

jest.mock("@/stores/specialMode", () => ({
  useSpecialModeStore: () => mockUseSpecialModeStore(),
}));

describe("ControlPanel.vue", () => {
  // Helper function to create the component
  const createWrapper = (options = {}) => {
    return mount(ControlPanel, {
      ...options,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders account buttons correctly", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    const accountButtons = wrapper.findAll(
      '[data-test="account-selector-button"]'
    );
    expect(accountButtons).toHaveLength(3); // 3 accounts

    // Check if all account names are displayed correctly
    expect(accountButtons.at(0).text().trim()).toBe("Account 1");
    expect(accountButtons.at(1).text().trim()).toBe("Account 2");
    expect(accountButtons.at(2).text().trim()).toBe("Account 3");
  });

  test("highlights the current account", () => {
    // Arrange
    mockUseAccountStore.mockReturnValue({
      currentAccount: { id: "account2", name: "Account 2" },
      setAccount,
    });

    // Act
    const wrapper = createWrapper();
    const accountButtons = wrapper.findAll(
      '[data-test="account-selector-button"]'
    );

    // Assert
    // Account 1 should not be highlighted
    expect(accountButtons.at(0).classes()).not.toContain("bg-white");
    expect(accountButtons.at(0).classes()).not.toContain("shadow");
    expect(accountButtons.at(0).classes()).not.toContain("text-gray-800");

    // Account 2 should be highlighted
    expect(accountButtons.at(1).classes()).toContain("bg-white");
    expect(accountButtons.at(1).classes()).toContain("shadow");
    expect(accountButtons.at(1).classes()).toContain("text-gray-800");

    // Account 3 should not be highlighted
    expect(accountButtons.at(2).classes()).not.toContain("bg-white");
    expect(accountButtons.at(2).classes()).not.toContain("shadow");
    expect(accountButtons.at(2).classes()).not.toContain("text-gray-800");
  });

  test("calls setAccount when an account is selected", async () => {
    // Arrange
    const wrapper = createWrapper();
    const accountButtons = wrapper.findAll(
      '[data-test="account-selector-button"]'
    );

    // Act
    await accountButtons.at(1).trigger("click");

    // Assert
    expect(setAccount).toHaveBeenCalledWith({
      id: "account2",
      name: "Account 2",
    });
  });

  test("renders special mode buttons correctly", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    const modeButtons = wrapper.findAll('[data-test="special-mode-button"]');
    expect(modeButtons).toHaveLength(2); // PRIMARY and SECONDARY

    // Check if mode names are displayed correctly
    expect(modeButtons.at(0).text().trim()).toBe("PRIMARY");
    expect(modeButtons.at(1).text().trim()).toBe("SECONDARY");
  });

  test("highlights the current special mode", () => {
    // Arrange
    mockUseSpecialModeStore.mockReturnValue({
      mode: "PRIMARY",
      setMode,
    });

    // Act
    const wrapper = createWrapper();
    const modeButtons = wrapper.findAll('[data-test="special-mode-button"]');

    // Assert
    // PRIMARY should be highlighted
    expect(modeButtons.at(0).classes()).toContain("bg-white");
    expect(modeButtons.at(0).classes()).toContain("shadow");
    expect(modeButtons.at(0).classes()).toContain("text-gray-800");

    // SECONDARY should not be highlighted
    expect(modeButtons.at(1).classes()).not.toContain("bg-white");
    expect(modeButtons.at(1).classes()).not.toContain("shadow");
    expect(modeButtons.at(1).classes()).not.toContain("text-gray-800");
  });

  test("calls setMode when a special mode is selected", async () => {
    // Arrange
    const wrapper = createWrapper();
    const modeButtons = wrapper.findAll('[data-test="special-mode-button"]');

    // Act
    await modeButtons.at(1).trigger("click");

    // Assert
    expect(setMode).toHaveBeenCalledWith("SECONDARY");
  });

  test("displays the modal buttons", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    const modalButtons = wrapper
      .findAll("button")
      .filter(
        (button) =>
          button.text().includes("Modal 1") || button.text().includes("Modal 2")
      );
    expect(modalButtons).toHaveLength(2);
    expect(modalButtons.at(0).text()).toBe("Modal 1");
    expect(modalButtons.at(1).text()).toBe("Modal 2");
  });

  test("calls openModal when a modal button is clicked", async () => {
    // Arrange
    const wrapper = createWrapper();
    const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
    const modalButtons = wrapper
      .findAll("button")
      .filter(
        (button) =>
          button.text().includes("Modal 1") || button.text().includes("Modal 2")
      );

    // Act
    await modalButtons.at(0).trigger("click");

    // Assert
    expect(spy).toHaveBeenCalledWith("Opening modal 1");
    spy.mockRestore();
  });
});
