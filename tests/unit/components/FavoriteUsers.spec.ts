import { mount } from "@vue/test-utils";
import FavoriteUsers from "@/components/FavoriteUsers.vue";
import { Account, User } from "@/types/api";

interface AccountStoreState {
  currentAccount: Account | null;
  favoriteUsers: User[];
  favoriteUsersFetched: boolean;
  fetchFavoriteUsers: jest.Mock;
  clearFavoriteUsers: jest.Mock;
}

const fetchFavoriteUsers = jest.fn().mockResolvedValue(true);
const clearFavoriteUsers = jest.fn();

// Mock account store
const mockUseAccountStore = jest.fn<AccountStoreState, []>(() => ({
  currentAccount: { id: "account1", name: "Account 1" },
  favoriteUsers: [],
  favoriteUsersFetched: false,
  fetchFavoriteUsers,
  clearFavoriteUsers,
}));

jest.mock("@/stores/account", () => ({
  useAccountStore: () => mockUseAccountStore(),
}));

describe("FavoriteUsers.vue", () => {
  // Helper function to create the component
  const createWrapper = (options = {}) => {
    return mount(FavoriteUsers, {
      ...options,
      stubs: {
        LoadingSpinner: {
          template: "<div>Loading...</div>",
        },
        "v-wait": {
          template: "<div><slot></slot></div>",
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAccountStore.mockClear();
  });

  test("renders the button with correct text when collapsed", () => {
    // Arrange
    const wrapper = createWrapper();

    // Assert
    const button = wrapper.find('[data-test="toggle-button"]');
    expect(button.text()).toBe("Click to Show Favorite Users");
  });

  test("renders the button with correct text when expanded", async () => {
    // Arrange
    const wrapper = createWrapper();
    const button = wrapper.find('[data-test="toggle-button"]');

    // Act
    await button.trigger("click");

    // Assert
    expect(button.text()).toBe("Hide Favorite Users");
  });

  test("toggles expand state when button is clicked", async () => {
    // Arrange
    const wrapper = createWrapper();

    // Act
    await wrapper.find('[data-test="toggle-button"]').trigger("click");

    // Assert
    expect(wrapper.vm.$data.isExpanded).toBe(true);
    expect(wrapper.find('[data-test="expanded-content"]').exists()).toBe(true);

    // Act again
    await wrapper.find('[data-test="toggle-button"]').trigger("click");

    // Assert
    expect(wrapper.vm.$data.isExpanded).toBe(false);
    expect(wrapper.find('[data-test="expanded-content"]').exists()).toBe(false);
  });

  test("calls fetchFavoriteUsers when expanded and not already fetched", async () => {
    // Arrange
    mockUseAccountStore.mockReturnValue({
      currentAccount: { id: "account1", name: "Account 1" },
      favoriteUsers: [],
      favoriteUsersFetched: false,
      fetchFavoriteUsers,
      clearFavoriteUsers,
    });
    const wrapper = createWrapper();

    // Act
    await wrapper.find('[data-test="toggle-button"]').trigger("click");

    // Assert
    expect(fetchFavoriteUsers).toHaveBeenCalledTimes(1);
  });

  test("does not call fetchFavoriteUsers when expanded but already fetched", async () => {
    // Arrange
    mockUseAccountStore.mockReturnValue({
      currentAccount: { id: "account1", name: "Account 1" },
      favoriteUsers: [],
      favoriteUsersFetched: true,
      fetchFavoriteUsers,
      clearFavoriteUsers,
    });
    const wrapper = createWrapper();

    // Act
    await wrapper.find('[data-test="toggle-button"]').trigger("click");

    // Assert
    expect(fetchFavoriteUsers).not.toHaveBeenCalled();
  });

  test("does not call fetchFavoriteUsers when there is no current account", async () => {
    // Arrange - explicitly set currentAccount to null before the test
    mockUseAccountStore.mockReturnValue({
      currentAccount: null,
      favoriteUsers: [],
      favoriteUsersFetched: false,
      fetchFavoriteUsers,
      clearFavoriteUsers,
    });

    const wrapper = createWrapper();

    // Act
    await wrapper.find('[data-test="toggle-button"]').trigger("click");

    // Assert
    expect(fetchFavoriteUsers).not.toHaveBeenCalled();
  });

  test("renders favorite users when they exist", async () => {
    // Arrange
    const mockFavoriteUsers: User[] = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        avatar: "https://example.com/avatar.jpg",
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        avatar: "https://example.com/avatar2.jpg",
      },
    ];

    mockUseAccountStore.mockReturnValue({
      currentAccount: { id: "account1", name: "Account 1" },
      favoriteUsers: mockFavoriteUsers,
      favoriteUsersFetched: true,
      fetchFavoriteUsers,
      clearFavoriteUsers,
    });

    // Customize the v-wait stub to render the slot for this test
    const wrapper = mount(FavoriteUsers, {
      stubs: {
        LoadingSpinner: {
          template: "<div>Loading...</div>",
        },
        "v-wait": {
          template: "<div><slot></slot></div>",
        },
      },
    });

    // Act
    await wrapper.find('[data-test="toggle-button"]').trigger("click");
    await wrapper.vm.$nextTick(); // Wait for rendering to complete

    // Assert
    expect(wrapper.find('[data-test="users-table-container"]').exists()).toBe(
      true
    );
    expect(wrapper.find('[data-test="users-table"]').exists()).toBe(true);

    const rows = wrapper.findAll('[data-test="user-row"]');
    expect(rows).toHaveLength(2);

    // Check first user
    expect(rows.at(0).find('[data-test="user-name"]').text()).toBe("John Doe");
    expect(rows.at(0).find('[data-test="user-email"]').text()).toBe(
      "john@example.com"
    );

    // Check second user
    expect(rows.at(1).find('[data-test="user-name"]').text()).toBe(
      "Jane Smith"
    );
    expect(rows.at(1).find('[data-test="user-email"]').text()).toBe(
      "jane@example.com"
    );
  });

  test("renders 'No favorite users found' when list is empty", async () => {
    // Arrange
    mockUseAccountStore.mockReturnValue({
      currentAccount: { id: "account1", name: "Account 1" },
      favoriteUsers: [],
      favoriteUsersFetched: true,
      fetchFavoriteUsers,
      clearFavoriteUsers,
    });

    const wrapper = mount(FavoriteUsers, {
      stubs: {
        LoadingSpinner: {
          template: "<div>Loading...</div>",
        },
        "v-wait": {
          template: "<div><slot></slot></div>",
        },
      },
    });

    // Act
    await wrapper.find('[data-test="toggle-button"]').trigger("click");
    await wrapper.vm.$nextTick();

    // Assert
    expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="empty-message"]').text()).toBe(
      "No favorite users found"
    );
  });

  test("calls clearFavoriteUsers when component is destroyed", () => {
    // Arrange
    const wrapper = createWrapper();

    // Act
    wrapper.destroy();

    // Assert
    expect(clearFavoriteUsers).toHaveBeenCalledTimes(1);
  });
});
