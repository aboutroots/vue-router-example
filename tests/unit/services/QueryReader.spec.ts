import { queryReader } from "@/services/QueryReader";
import router from "@/router";
import { Route } from "vue-router";

// Mock the router and its dynamic import
jest.mock("@/router", () => ({
  currentRoute: {
    query: {},
  },
  __esModule: true,
  default: {
    currentRoute: {
      query: {},
    },
  },
}));

describe("QueryReader", () => {
  beforeEach(() => {
    // Reset router mock before each test
    (router.currentRoute.query as any) = {};
  });

  describe("getQueryParam", () => {
    it("returns query parameter value when it exists", async () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };

      // Act & Assert
      expect(await queryReader.getQueryParam("page")).toBe("1");
      expect(await queryReader.getQueryParam("search")).toBe("test");
    });

    it("returns first value if there are multiple values", async () => {
      // Arrange
      (router.currentRoute.query as any) = {
        search: ["test", "test2"],
      };

      // Act & Assert
      expect(await queryReader.getQueryParam("search")).toBe("test");
    });

    it("returns null when query parameter does not exist", async () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };

      // Act & Assert
      expect(await queryReader.getQueryParam("nonexistent")).toBeNull();
    });
  });

  describe("getQueryParamFromRoute", () => {
    it("returns query parameter value from route when it exists", () => {
      // Arrange
      const route = {
        query: {
          page: "1",
          search: "test",
        },
      } as unknown as Route;

      // Act & Assert
      expect(queryReader.getQueryParamFromRoute(route, "page")).toBe("1");
      expect(queryReader.getQueryParamFromRoute(route, "search")).toBe("test");
    });

    it("returns first value from route if there are multiple values", () => {
      // Arrange
      const route = {
        query: {
          search: ["test", "test2"],
        },
      } as unknown as Route;

      // Act & Assert
      expect(queryReader.getQueryParamFromRoute(route, "search")).toBe("test");
    });

    it("returns null when route query parameter does not exist", () => {
      // Arrange
      const route = {
        query: {
          page: "1",
          search: "test",
        },
      } as unknown as Route;

      // Act & Assert
      expect(
        queryReader.getQueryParamFromRoute(route, "nonexistent")
      ).toBeNull();
    });
  });

  describe("hasQueryParams", () => {
    it("returns true when current URL has query parameters", async () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };

      // Act & Assert
      expect(await queryReader.hasQueryParams()).toBe(true);
    });

    it("returns false when current URL has no query parameters", async () => {
      // Arrange
      (router.currentRoute.query as any) = {};

      // Act & Assert
      expect(await queryReader.hasQueryParams()).toBe(false);
    });
  });

  describe("routeHasQueryParams", () => {
    it("returns true when route has query parameters", () => {
      // Arrange
      const route = {
        query: {
          page: "1",
          search: "test",
        },
      } as unknown as Route;

      // Act & Assert
      expect(queryReader.routeHasQueryParams(route)).toBe(true);
    });

    it("returns false when route has no query parameters", () => {
      // Arrange
      const route = {
        query: {},
      } as Route;

      // Act & Assert
      expect(queryReader.routeHasQueryParams(route)).toBe(false);
    });
  });

  describe("getAllQueryParams", () => {
    it("returns all query parameters from current URL", async () => {
      // Arrange
      (router.currentRoute.query as any) = {
        page: "1",
        search: "test",
      };

      // Act
      const result = await queryReader.getAllQueryParams();

      // Assert
      expect(result).toEqual({
        page: "1",
        search: "test",
      });
    });
  });

  describe("getAllQueryParamsFromRoute", () => {
    it("returns all query parameters from provided route", () => {
      // Arrange
      const route = {
        query: {
          page: "1",
          search: "test",
        },
      } as unknown as Route;

      // Act
      const result = queryReader.getAllQueryParamsFromRoute(route);

      // Assert
      expect(result).toEqual({
        page: "1",
        search: "test",
      });
    });
  });
});
