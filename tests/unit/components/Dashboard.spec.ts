import { mount } from "@vue/test-utils";
import Dashboard from "@/components/Dashboard.vue";

const setAccount = jest.fn();
const setUsersPage = jest.fn();

// Mock account store
const mockUseAccountStore = jest.fn().mockReturnValue({
  currentAccount: null,
  usersList: [],
  usersListPage: 1,
  usersListTotalPages: 1,
  usersListTotal: 0,
  setAccount,
  setUsersPage,
});

// Mock config store
const mockUseConfigStore = jest.fn().mockReturnValue({
  possibleAccounts: [
    { id: "account1", name: "Account 1" },
    { id: "account2", name: "Account 2" },
    { id: "account3", name: "Account 3" },
  ],
});

jest.mock("@/stores/account", () => ({
  useAccountStore: () => mockUseAccountStore(),
}));

jest.mock("@/stores/config", () => ({
  useConfigStore: () => mockUseConfigStore(),
}));

describe("Dashboard.vue", () => {
  // Helper function to create the component with custom options
  const createWrapper = (options = {}) => {
    return mount(Dashboard, {
      ...options,
      stubs: {
        LoadingSpinner: {
          template: "<div>Loading...</div>",
        },
        "v-wait": {
          template: "<div><slot name='waiting'></slot><slot></slot></div>",
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with initial state", async () => {
    // Arrange
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    // Assert
    // Check if account select has correct number of options
    const accountOptions = wrapper.findAll('[data-test="account-option"]');
    expect(accountOptions).toHaveLength(3); // 3 accounts

    // Check if first account option has correct text
    expect(accountOptions.at(0).text().trim()).toBe("Account 1");
  });

  test("calls setAccount when account is selected", async () => {
    // Arrange
    const wrapper = createWrapper();

    // Act
    const select = wrapper.find('[data-test="account-select"]');
    await select.setValue("account1");
    await select.trigger("change");

    // Assert
    expect(setAccount).toHaveBeenCalledWith({
      id: "account1",
      name: "Account 1",
    });
  });

  test("renders user data when account is selected", () => {
    // Arrange
    mockUseAccountStore.mockReturnValue({
      currentAccount: {
        id: "account1",
        name: "Account 1",
      },
      usersList: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          avatar: "https://example.com/avatar1.jpg",
        },
      ],
      usersListPage: 1,
      usersListTotalPages: 5,
      usersListTotal: 10,
      setAccount,
      setUsersPage,
    });

    // Act
    const wrapper = createWrapper();

    // Assert
    expect(wrapper.find('[data-test="account-heading"]').text()).toBe(
      "Users for Account 1"
    );
    expect(wrapper.find('[data-test="total-users"]').text()).toBe("Total: 10");

    // Check if correct number of pagination buttons are rendered
    const paginationButtons = wrapper.findAll('[data-test="page-button"]');
    expect(paginationButtons).toHaveLength(5); // 5 pages
  });

  test("calls setUsersPage when pagination button is clicked", async () => {
    // Arrange
    mockUseAccountStore.mockReturnValue({
      currentAccount: {
        id: "account1",
        name: "Account 1",
      },
      usersList: [],
      usersListPage: 1,
      usersListTotalPages: 3,
      usersListTotal: 15,
      setAccount,
      setUsersPage,
    });
    const wrapper = createWrapper();

    // Act
    const paginationButtons = wrapper.findAll('[data-test="page-button"]');
    await paginationButtons.at(1).trigger("click"); // Click on page 2

    // Assert
    expect(setUsersPage).toHaveBeenCalledWith(2);
  });
});
