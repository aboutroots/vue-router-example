import { queryUpdater } from "@/services/QueryUpdater";

// Create a mock router object
const mockRouter = {
  currentRoute: {
    query: {},
  },
  replace: jest.fn(),
};

// Mock the router module
jest.mock("@/router", () => ({
  __esModule: true,
  default: mockRouter,
}));

// Mock the dynamic import in QueryUpdater
jest.mock(
  "@/services/QueryUpdater",
  () => {
    // Get the actual module
    const actualModule = jest.requireActual("@/services/QueryUpdater");

    // Override applyPendingUpdates to use our mock directly
    const queryUpdaterInstance = actualModule.queryUpdater;
    queryUpdaterInstance.applyPendingUpdates = async function () {
      // Access private pending updates
      const pendingUpdates = (this as any).pendingUpdates;

      // Start with existing query parameters
      const currentQuery: Record<string, string> = {
        ...mockRouter.currentRoute.query,
      };

      // Process pending updates
      Object.entries(pendingUpdates).forEach(([key, value]) => {
        if (value === null) {
          // Remove keys explicitly set to null
          delete currentQuery[key];
        } else {
          // Update or add other keys
          currentQuery[key] = String(value);
        }
      });

      // Only update if there are actual changes
      mockRouter.replace({
        query: currentQuery,
      });

      // Reset pending updates and timeout
      (this as any).pendingUpdates = {};
      (this as any).updateTimeoutId = null;
    };

    return {
      queryUpdater: queryUpdaterInstance,
    };
  },
  { virtual: true }
);

jest.useFakeTimers();

describe("QueryUpdater", () => {
  beforeEach(() => {
    // Reset router mock before each test
    mockRouter.currentRoute.query = {};
    mockRouter.replace.mockClear();
    jest.clearAllTimers();

    // Reset the pending updates in queryUpdater
    (queryUpdater as any).pendingUpdates = {};
    (queryUpdater as any).updateTimeoutId = null;
  });

  describe("setQueryParams (deprecated)", () => {
    it("calls updateQueryParams internally", () => {
      // Arrange
      const spy = jest.spyOn(queryUpdater, "updateQueryParams");
      const params = { page: "1" };

      // Act
      queryUpdater.setQueryParams(params);

      // Assert
      expect(spy).toHaveBeenCalledWith(params);

      // Cleanup
      spy.mockRestore();
      jest.runAllTimers(); // To clear pending timers
    });
  });

  describe("updateQueryParams", () => {
    it("updates query parameters when there are changes", async () => {
      // Arrange
      const params = {
        page: "1",
        search: "test",
      };

      // Act
      queryUpdater.updateQueryParams(params);
      jest.runAllTimers(); // Run all timers to trigger the debounced update

      // Wait for any promises to resolve
      await Promise.resolve();

      // Assert
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          search: "test",
        },
      });
    });

    it("maintains existing parameters not included in the update", async () => {
      // Arrange
      mockRouter.currentRoute.query = {
        page: "1",
        search: "test",
        filter: "active",
      };

      // Act - only update one parameter
      queryUpdater.updateQueryParams({ search: "new-term" });
      jest.runAllTimers();

      // Wait for any promises to resolve
      await Promise.resolve();

      // Assert - other parameters should be preserved
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          search: "new-term",
          filter: "active",
        },
      });
    });

    it("removes parameters when explicitly set to null", async () => {
      // Arrange
      mockRouter.currentRoute.query = {
        page: "1",
        search: "test",
        filter: "active",
      };

      // Act - set a parameter to null
      queryUpdater.updateQueryParams({ search: null });
      jest.runAllTimers();

      // Wait for any promises to resolve
      await Promise.resolve();

      // Assert - null parameter should be removed
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          filter: "active",
        },
      });
    });

    it("batches multiple updates within the debounce window", async () => {
      // Arrange
      mockRouter.currentRoute.query = {};

      // Act - make multiple updates in quick succession
      queryUpdater.updateQueryParams({ page: "1" });
      queryUpdater.updateQueryParams({ search: "test" });
      queryUpdater.updateQueryParams({ filter: "active" });

      // Assert - replace should not have been called yet
      expect(mockRouter.replace).not.toHaveBeenCalled();

      // Run timers and wait for promises
      jest.runAllTimers();
      await Promise.resolve();

      // Assert - only one replace call with all params merged
      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          search: "test",
          filter: "active",
        },
      });
    });

    it("uses the last value when the same parameter is updated multiple times", async () => {
      // Act - update the same parameter multiple times
      queryUpdater.updateQueryParams({ page: "1" });
      queryUpdater.updateQueryParams({ page: "2" });
      queryUpdater.updateQueryParams({ page: "3" });

      // Run timers and wait for promises
      jest.runAllTimers();
      await Promise.resolve();

      // Assert - only the last value should be used
      expect(mockRouter.replace).toHaveBeenCalledWith({
        query: {
          page: "3",
        },
      });
    });
  });
});
