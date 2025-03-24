import { setActivePinia, createPinia } from "pinia";
import { useConfigStore } from "@/stores/config";
import configAPI from "@/services/api/resources/config";
import { WaitKey } from "@/constants";

jest.mock("@/services/api/resources/config", () => ({
  __esModule: true,
  default: {
    getConfig: jest.fn(),
  },
}));

describe("Config Store", () => {
  let store: ReturnType<typeof useConfigStore>;
  const mockWait = {
    start: jest.fn(),
    end: jest.fn(),
  };

  beforeEach(() => {
    // Arrange
    setActivePinia(createPinia());
    store = useConfigStore();
    // Mock $wait
    store.$wait = mockWait as any;
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Replace with mock function so that it doesn't spam the console
    jest.spyOn(console, "error").mockImplementation(jest.fn());
  });

  describe("loadConfig", () => {
    const mockConfigResponse = {
      defaultAccountId: "default-account-id",
      possibleAccounts: [
        { id: "default-account-id", name: "Default Account" },
        { id: "account2", name: "Account 2" },
        { id: "account3", name: "Account 3" },
      ],
    };

    it("should update state with config data on successful API call", async () => {
      // Arrange
      (configAPI.getConfig as jest.Mock).mockResolvedValue(mockConfigResponse);

      // Act
      await store.loadConfig();

      // Assert
      expect(store.defaultAccountId).toBe("default-account-id");
      expect(store.possibleAccounts).toEqual(
        mockConfigResponse.possibleAccounts
      );
      expect(store.isLoaded).toBe(true);
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_CONFIG);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_CONFIG);
    });

    it("should handle API errors gracefully", async () => {
      // Arrange
      const error = new Error("Config API Error");
      (configAPI.getConfig as jest.Mock).mockRejectedValue(error);

      // Act
      await store.loadConfig();

      // Assert
      expect(store.defaultAccountId).toBe("");
      expect(store.possibleAccounts).toEqual([]);
      expect(store.isLoaded).toBe(false);
      expect(mockWait.start).toHaveBeenCalledWith(WaitKey.FETCH_CONFIG);
      expect(mockWait.end).toHaveBeenCalledWith(WaitKey.FETCH_CONFIG);
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching config:",
        error
      );
    });

    it("should initially have correct default values", () => {
      // Arrange / Act - store is already created in beforeEach

      // Assert
      expect(store.defaultAccountId).toBe("");
      expect(store.possibleAccounts).toEqual([]);
      expect(store.isLoaded).toBe(false);
    });
  });
});
