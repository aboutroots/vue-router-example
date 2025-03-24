import { setActivePinia, createPinia } from "pinia";
import { useAccountStore } from "@/stores/account";
import usersApi from "@/services/api/resources/users";
import { WaitKey } from "@/constants";

jest.mock("@/services/api/resources/users", () => ({
  __esModule: true,
  default: {
    getUsers: jest.fn(),
    getFavoriteUsers: jest.fn(),
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
    jest.spyOn(console, "error").mockImplementation(jest.fn());
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

    it("should fetch favorite users when favoriteUsersFetched is true", async () => {
      // Arrange
      const mockFavoriteUsers = [
        {
          id: 3,
          email: "favorite@example.com",
          first_name: "Favorite",
          last_name: "User",
          avatar: "https://example.com/avatar3.jpg",
        },
      ];

      (usersApi.getUsers as jest.Mock).mockResolvedValue(mockUsersResponse);
      (usersApi.getFavoriteUsers as jest.Mock).mockResolvedValue(
        mockFavoriteUsers
      );

      // Set initial state with favoriteUsersFetched true
      store.favoriteUsersFetched = true;

      // Act
      await store.setAccount(mockAccount);

      // Assert
      expect(usersApi.getFavoriteUsers).toHaveBeenCalledWith(mockAccount.id);
      expect(store.favoriteUsers).toEqual(mockFavoriteUsers);
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_FAVORITE_USERS);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_FAVORITE_USERS);
    });

    it("should not fetch favorite users when favoriteUsersFetched is false", async () => {
      // Arrange
      (usersApi.getUsers as jest.Mock).mockResolvedValue(mockUsersResponse);

      // Act
      await store.setAccount(mockAccount);

      // Assert
      expect(usersApi.getFavoriteUsers).not.toHaveBeenCalled();
      expect(store.favoriteUsers).toEqual([]);
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

  describe("fetchFavoriteUsers", () => {
    const mockAccount = {
      id: "test-id",
      name: "Test Account",
    };

    const mockFavoriteUsers = [
      {
        id: 3,
        email: "favorite@example.com",
        first_name: "Favorite",
        last_name: "User",
        avatar: "https://example.com/avatar3.jpg",
      },
      {
        id: 4,
        email: "favorite2@example.com",
        first_name: "Favorite2",
        last_name: "User2",
        avatar: "https://example.com/avatar4.jpg",
      },
    ];

    beforeEach(() => {
      // Set current account
      store.currentAccount = mockAccount;
    });

    it("should fetch favorite users and update state", async () => {
      // Arrange
      (usersApi.getFavoriteUsers as jest.Mock).mockResolvedValue(
        mockFavoriteUsers
      );

      // Act
      const result = await store.fetchFavoriteUsers();

      // Assert
      expect(result).toBe(true);
      expect(usersApi.getFavoriteUsers).toHaveBeenCalledWith(mockAccount.id);
      expect(store.favoriteUsers).toEqual(mockFavoriteUsers);
      expect(store.favoriteUsersFetched).toBe(true);
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_FAVORITE_USERS);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_FAVORITE_USERS);
    });

    it("should handle API errors when fetching favorite users", async () => {
      // Arrange
      const error = new Error("API Error");
      (usersApi.getFavoriteUsers as jest.Mock).mockRejectedValue(error);

      // Act
      const result = await store.fetchFavoriteUsers();

      // Assert
      expect(result).toBe(false);
      expect(usersApi.getFavoriteUsers).toHaveBeenCalledWith(mockAccount.id);
      expect(store.favoriteUsers).toEqual([]);
      expect(store.favoriteUsersFetched).toBe(false);
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_FAVORITE_USERS);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_FAVORITE_USERS);
    });

    it("should return false if no current account is set", async () => {
      // Arrange
      store.currentAccount = null;

      // Act
      const result = await store.fetchFavoriteUsers();

      // Assert
      expect(result).toBe(false);
      expect(usersApi.getFavoriteUsers).not.toHaveBeenCalled();
    });
  });

  describe("clearFavoriteUsers", () => {
    it("should clear favorite users and reset favoriteUsersFetched flag", () => {
      // Arrange
      store.favoriteUsers = [
        {
          id: 1,
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          avatar: "https://example.com/avatar.jpg",
        },
      ];
      store.favoriteUsersFetched = true;

      // Act
      store.clearFavoriteUsers();

      // Assert
      expect(store.favoriteUsers).toEqual([]);
      expect(store.favoriteUsersFetched).toBe(false);
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
