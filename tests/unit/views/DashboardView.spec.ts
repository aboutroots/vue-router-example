import { mount } from "@vue/test-utils";
import DashboardView from "@/views/DashboardView.vue";

const setAccount = jest.fn();
const setUsersPage = jest.fn();

const mockUseAccountStore = jest.fn().mockReturnValue({
  currentAccount: null,
  usersList: [],
  usersListPage: 1,
  usersListTotalPages: 1,
  usersListTotal: 0,
  setAccount,
  setUsersPage,
});

jest.mock("@/stores/account", () => ({
  useAccountStore: () => mockUseAccountStore(),
}));

describe("DashboardView", () => {
  // Helper function to create the component with custom options
  const createWrapper = (
    options: {
      data?: Record<string, any>;
    } = {}
  ) => {
    return mount(DashboardView, {
      data() {
        return {
          ...options.data,
        };
      },
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

  test("renders correctly with initial state", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    // Check if account select has correct number of options
    const accountOptions = wrapper.findAll('[data-test="account-option"]');
    expect(accountOptions).toHaveLength(3); // 3 accounts

    // Check if first account option has correct text
    expect(accountOptions.at(0).text().trim()).toBe("Account 1");

    // Check we can click on an account option
    const accountSelect = wrapper.find('[data-test="account-select"]');
    await accountSelect.setValue("d1f9f052-62c2-4d72-8c2d-36dc04ad6ba0");
    await wrapper.vm.$nextTick();
    expect(setAccount).toHaveBeenCalledTimes(1);
  });

  test("renders correctly when account is selected", () => {
    mockUseAccountStore.mockReturnValue({
      currentAccount: {
        id: "d1f9f052-62c2-4d72-8c2d-36dc04ad6ba0",
        name: "Account 1",
      },
      usersList: [
        {
          id: 1,
          name: "John Doe",
        },
      ],
      usersListPage: 1,
      usersListTotalPages: 5,
      usersListTotal: 5,
      setAccount,
      setUsersPage,
    });
    const wrapper = createWrapper({
      data: {
        selectedAccountId: "d1f9f052-62c2-4d72-8c2d-36dc04ad6ba0",
      },
    });

    expect(wrapper.find('[data-test="account-heading"]').text()).toBe(
      "Users for Account 1"
    );

    expect(wrapper.find('[data-test="total-users"]').text()).toBe("Total: 5");

    // // Check if correct number of pagination buttons are rendered
    const paginationButtons = wrapper.findAll('[data-test="page-button"]');
    expect(paginationButtons).toHaveLength(5); // 5 pages

    // Check we can click on the pagination button
    paginationButtons.at(0).trigger("click");
    expect(setUsersPage).toHaveBeenCalledWith(1);
  });
});
