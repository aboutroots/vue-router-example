import { queryParser } from "@/services/QueryParser";
import router from "@/router";

// Mock the router
jest.mock("@/router", () => ({
  currentRoute: {
    query: {},
  },
  replace: jest.fn(),
}));

// Mock setTimeout and clearTimeout for testing debounce
jest.useFakeTimers();

describe("QueryParser", () => {
  beforeEach(() => {
    // Reset router mock before each test
    (router.currentRoute.query as any) = {};
    (router.replace as jest.Mock).mockClear();
    jest.clearAllTimers();
  });

  describe("setQueryParams", () => {
    it("updates query parameters when there are changes", () => {
      // Arrange
      const params = {
        page: "1",
        search: "test",
      };

      // Act
      queryParser.setQueryParams(params);
      jest.runAllTimers(); // Run all timers to trigger the debounced update

      // Assert
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          search: "test",
        },
      });
    });

    // New test for debouncing functionality
    it("debounces multiple calls and batches parameter updates", () => {
      // Act: Make multiple calls with different parameters in quick succession
      queryParser.setQueryParams({ page: "1" });
      queryParser.setQueryParams({ search: "test" });
      queryParser.setQueryParams({ page: "2" }); // This should override the previous page value

      // Verify no updates have happened yet
      expect(router.replace).not.toHaveBeenCalled();

      // Fast-forward timers to trigger the debounced update
      jest.runAllTimers();

      // Assert: Only one update should have occurred with the merged parameters
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          page: "2", // Last value wins
          search: "test",
        },
      });
    });

    it("clears existing timeout when new calls to setQueryParams are made", () => {
      // Spy on clearTimeout
      const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");

      // First call - should set a timeout but not clear any
      queryParser.setQueryParams({ page: "1" });
      expect(clearTimeoutSpy).not.toHaveBeenCalled();

      // Second call - should clear the previous timeout
      queryParser.setQueryParams({ search: "test" });
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

      // Third call - should clear the timeout again
      queryParser.setQueryParams({ filter: "active" });
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);

      // Run timers and check the final result
      jest.runAllTimers();
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          search: "test",
          filter: "active",
        },
      });

      // Clean up spy
      clearTimeoutSpy.mockRestore();
    });

    it("removes all query parameters when all values are null/empty", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };
      const params = {
        search: null,
      };

      // Act
      queryParser.setQueryParams(params);
      jest.runAllTimers(); // Run all timers to trigger the debounced update

      // Assert
      expect(router.replace).toHaveBeenCalledWith({
        query: {},
      });
    });

    it("removes query parameter when value is null", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };
      const params = {
        page: "1",
        search: null,
      };

      // Act
      queryParser.setQueryParams(params);
      jest.runAllTimers(); // Run all timers to trigger the debounced update

      // Assert
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
        },
      });
    });
    it("removes query parameter when value is missing", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };
      const params = {
        page: "1",
      };

      // Act
      queryParser.setQueryParams(params);
      jest.runAllTimers(); // Run all timers to trigger the debounced update

      // Assert
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
        },
      });
    });

    it("does not update when there are no changes", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };
      const params = {
        page: 1,
        search: "test",
      };

      // Act
      queryParser.setQueryParams(params);
      jest.runAllTimers(); // Run all timers to trigger the debounced update

      // Assert
      expect(router.replace).not.toHaveBeenCalled();
    });

    it("converts all values to strings", () => {
      // Arrange
      const params: Record<string, string | null> = {
        page: "1",
        search: "test",
        active: "true",
      };

      // Act
      queryParser.setQueryParams(params);
      jest.runAllTimers(); // Run all timers to trigger the debounced update

      // Assert
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          search: "test",
          active: "true",
        },
      });
    });
  });

  describe("getQueryParam", () => {
    it("returns query parameter value when it exists", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: 1,
        search: "test",
      };

      // Act & Assert
      expect(queryParser.getQueryParam("page")).toBe(1);
      expect(queryParser.getQueryParam("search")).toBe("test");
    });

    /**
     * If the parameter is an array, it returns the first value.
     * This can happen if the query param is multiplied in the URL.
     * This is generally a bad practice to do this intentionally, so we assume
     * that it won't happen and we only take the first value. This way we are
     * type safe and don't need to handle arrays.
     */
    it("returns first value if there are multiple values", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        search: ["test", "test2"],
      };

      // Act & Assert
      expect(queryParser.getQueryParam("search")).toBe("test");
    });

    it("returns null when query parameter does not exist", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };

      // Act & Assert
      expect(queryParser.getQueryParam("nonexistent")).toBeNull();
    });

    it("returns null when query parameter is empty string", () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "",
        search: "test",
      };

      // Act & Assert
      expect(queryParser.getQueryParam("page")).toBeNull();
      expect(queryParser.getQueryParam("search")).toBe("test");
    });
  });
});
