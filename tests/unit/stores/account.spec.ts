import { setActivePinia, createPinia } from "pinia";
import { useAccountStore } from "@/stores/account";
import usersApi from "@/services/api/resources/users";
import { WaitKey } from "@/constants";

jest.mock("@/services/api/resources/users", () => ({
  __esModule: true,
  default: {
    getUsers: jest.fn(),
  },
}));

describe("Account Store", () => {
  let store: ReturnType<typeof useAccountStore>;
  const mockWait = {
    start: jest.fn(),
    end: jest.fn(),
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAccountStore();
    // Mock $wait
    store.$wait = mockWait as any;
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Replace with mock function so that it doesn't spam the console
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("setAccount", () => {
    const mockAccount = {
      id: "test-id",
      name: "Test Account",
    };

    const mockUsersResponse = {
      page: 1,
      per_page: 2,
      total: 4,
      total_pages: 2,
      data: [
        {
          id: 1,
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          avatar: "https://example.com/avatar.jpg",
        },
        {
          id: 2,
          email: "test2@example.com",
          first_name: "Test2",
          last_name: "User2",
          avatar: "https://example.com/avatar2.jpg",
        },
      ],
    };

    it("should reset state and fetch first page when setting new account", async () => {
      // Arrange
      (usersApi.getUsers as jest.Mock).mockResolvedValue(mockUsersResponse);
      // Set some initial state
      store.usersList = [
        {
          id: 999,
          email: "old@example.com",
          first_name: "Old",
          last_name: "User",
          avatar: "",
        },
      ];
      store.usersListPage = 2;
      store.usersListTotalPages = 5;
      store.usersListTotal = 50;

      // Act
      await store.setAccount(mockAccount);

      // Assert
      expect(store.currentAccount).toEqual(mockAccount);
      expect(store.usersList).toEqual(mockUsersResponse.data);
      expect(store.usersListPage).toBe(1);
      expect(store.usersListTotalPages).toBe(2);
      expect(store.usersListTotal).toBe(4);
      expect(usersApi.getUsers).toHaveBeenCalledWith({
        accountId: mockAccount.id,
        page: 1,
      });
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
    });

    it("should handle API errors when setting account", async () => {
      // Arrange
      const error = new Error("API Error");
      (usersApi.getUsers as jest.Mock).mockRejectedValue(error);

      // Act
      await store.setAccount(mockAccount);

      // Assert
      expect(store.currentAccount).toEqual(mockAccount);
      expect(store.usersList).toEqual([]);
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
    });
  });

  describe("setUsersPage", () => {
    const mockUsersResponse = {
      page: 2,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: [
        {
          id: 2,
          email: "test2@example.com",
          first_name: "Test",
          last_name: "User",
          avatar: "https://example.com/avatar.jpg",
        },
      ],
    };

    beforeEach(() => {
      // Setup initial state
      store.usersListTotalPages = 2;
      store.usersListPage = 1;
      (usersApi.getUsers as jest.Mock).mockResolvedValue(mockUsersResponse);
    });

    it("should fetch new page when page number is valid", async () => {
      // Act
      await store.setUsersPage(2);

      // Assert
      expect(store.usersList).toEqual(mockUsersResponse.data);
      expect(store.usersListPage).toBe(2);
      expect(store.usersListTotalPages).toBe(2);
      expect(store.usersListTotal).toBe(12);
      expect(usersApi.getUsers).toHaveBeenCalledWith({
        accountId: "",
        page: 2,
      });
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
    });

    it("should not fetch when page number is less than 1 or greater than total pages", async () => {
      // Arrange
      store.usersListTotalPages = 2;

      // Act
      await store.setUsersPage(0);
      await store.setUsersPage(3);

      // Assert
      expect(usersApi.getUsers).not.toHaveBeenCalled();
      expect(mockWait.start).not.toHaveBeenCalled();
      expect(mockWait.end).not.toHaveBeenCalled();
    });

    it("should handle API errors when fetching new page", async () => {
      // Arrange
      const error = new Error("API Error");
      (usersApi.getUsers as jest.Mock).mockRejectedValue(error);

      // Act
      await store.setUsersPage(2);

      // Assert
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_USERS);
    });
  });
});
