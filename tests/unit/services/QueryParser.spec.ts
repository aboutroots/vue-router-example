import { queryParser } from "@/services/QueryParser";
import router from "@/router";

// Mock the router
jest.mock("@/router", () => ({
  currentRoute: {
    query: {},
  },
  replace: jest.fn(),
}));

describe("QueryParser", () => {
  beforeEach(() => {
    // Reset router mock before each test
    (router.currentRoute.query as any) = {};
    (router.replace as jest.Mock).mockClear();
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

      // Assert
      expect(router.replace).toHaveBeenCalledWith({
        query: {
          page: "1",
          search: "test",
        },
      });
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
