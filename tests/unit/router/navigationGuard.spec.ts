import { Route } from "vue-router";
import { queryParamSynchronizer } from "@/services/QueryParamSynchronizer";
import { queryReader } from "@/services/QueryReader";
import initializeApp from "@/services/initialize";

// Mock dependencies
jest.mock("@/services/QueryParamSynchronizer", () => ({
  queryParamSynchronizer: {
    processQueryParams: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@/services/QueryReader", () => ({
  queryReader: {
    routeHasQueryParams: jest.fn(),
  },
}));

jest.mock("@/services/initialize", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

// Create config store mock object
const mockConfigStore = {
  loadConfig: jest.fn().mockResolvedValue(undefined),
  markAsInitialized: jest.fn(),
  isLoaded: false,
  isAppInitialized: false,
};

// Mock stores
jest.mock("@/stores/config", () => ({
  useConfigStore: jest.fn().mockImplementation(() => mockConfigStore),
}));

// Import after mocking
import router from "@/router";

// Define the navigation guard types
type BeforeNavigationGuard = (
  to: Route,
  from: Route,
  next: (to?: any) => void
) => void;

type AfterNavigationGuard = (to: Route) => void;

describe("Router navigation guards", () => {
  let beforeNavigationGuard: BeforeNavigationGuard;
  let afterNavigationGuard: AfterNavigationGuard;
  let next: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockConfigStore.isLoaded = false;
    mockConfigStore.isAppInitialized = false;

    // Setup next mock
    next = jest.fn();

    // Extract the navigation guard functions from router
    beforeNavigationGuard = (router as any).beforeHooks[0];
    afterNavigationGuard = (router as any).afterHooks[0];
  });

  describe("beforeEach guard", () => {
    it("loads config when config is not loaded", async () => {
      // Arrange
      const to = { query: {} } as unknown as Route;
      const from = { query: {} } as unknown as Route;
      mockConfigStore.isLoaded = false;

      // Act
      await beforeNavigationGuard(to, from, next);

      // Assert
      expect(mockConfigStore.loadConfig).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it("does not load config when config is already loaded", async () => {
      // Arrange
      const to = { query: {} } as unknown as Route;
      const from = { query: {} } as unknown as Route;
      mockConfigStore.isLoaded = true;

      // Act
      await beforeNavigationGuard(to, from, next);

      // Assert
      expect(mockConfigStore.loadConfig).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it("calls next without processing query params when there are no query parameters", async () => {
      // Arrange
      const to = { query: {} } as unknown as Route;
      const from = { query: {} } as unknown as Route;
      mockConfigStore.isLoaded = true;

      // Mock queryReader to return false (no query params)
      (queryReader.routeHasQueryParams as jest.Mock).mockReturnValue(false);

      // Act
      await beforeNavigationGuard(to, from, next);

      // Assert
      expect(queryReader.routeHasQueryParams).toHaveBeenCalledWith(to);
      expect(queryParamSynchronizer.processQueryParams).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it("calls next without processing query params when query params have not changed", async () => {
      // Arrange
      const query = { page: "1" };
      const to = { query } as unknown as Route;
      const from = { query } as unknown as Route; // Same query object
      mockConfigStore.isLoaded = true;

      // Mock queryReader to return true (has query params)
      (queryReader.routeHasQueryParams as jest.Mock).mockReturnValue(true);

      // Act
      await beforeNavigationGuard(to, from, next);

      // Assert
      expect(queryReader.routeHasQueryParams).toHaveBeenCalledWith(to);
      expect(queryParamSynchronizer.processQueryParams).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it("processes query params when query params exist and have changed", async () => {
      // Arrange
      const to = { query: { page: "2" } } as unknown as Route;
      const from = { query: { page: "1" } } as unknown as Route;
      mockConfigStore.isLoaded = true;

      // Mock queryReader to return true (has query params)
      (queryReader.routeHasQueryParams as jest.Mock).mockReturnValue(true);

      // Act
      await beforeNavigationGuard(to, from, next);

      // Assert
      expect(queryReader.routeHasQueryParams).toHaveBeenCalledWith(to);
      expect(queryParamSynchronizer.processQueryParams).toHaveBeenCalledWith(
        to,
        {
          updateUrl: true,
        }
      );
      expect(next).toHaveBeenCalled();
    });

    it("waits for processQueryParams to complete before calling next", async () => {
      // Arrange
      const to = { query: { page: "2" } } as unknown as Route;
      const from = { query: { page: "1" } } as unknown as Route;
      mockConfigStore.isLoaded = true;

      // Create a delayed promise to test async behavior
      let resolveProcessPromise: (value?: unknown) => void = () => {
        /* This function will be replaced when the Promise is created */
      };
      const processPromise = new Promise((resolve) => {
        resolveProcessPromise = resolve;
      });

      // Mock queryReader to return true (has query params)
      (queryReader.routeHasQueryParams as jest.Mock).mockReturnValue(true);

      // Mock processQueryParams to return our controlled promise
      (queryParamSynchronizer.processQueryParams as jest.Mock).mockReturnValue(
        processPromise
      );

      // Act
      const guardPromise = beforeNavigationGuard(to, from, next);

      // Assert that next hasn't been called yet
      expect(next).not.toHaveBeenCalled();

      // Resolve the process promise
      resolveProcessPromise();

      // Wait for navigation guard to complete
      await guardPromise;

      // Now next should have been called
      expect(next).toHaveBeenCalled();
    });
  });

  describe("afterEach guard", () => {
    it("does not initialize app when config is not loaded", async () => {
      // Arrange
      const to = { query: {} } as unknown as Route;
      mockConfigStore.isLoaded = false;
      mockConfigStore.isAppInitialized = false;

      // Act
      await afterNavigationGuard(to);

      // Assert
      expect(initializeApp).not.toHaveBeenCalled();
      expect(mockConfigStore.markAsInitialized).not.toHaveBeenCalled();
    });

    it("does not initialize app when it's already initialized", async () => {
      // Arrange
      const to = { query: {} } as unknown as Route;
      mockConfigStore.isLoaded = true;
      mockConfigStore.isAppInitialized = true;

      // Act
      await afterNavigationGuard(to);

      // Assert
      expect(initializeApp).not.toHaveBeenCalled();
      expect(mockConfigStore.markAsInitialized).not.toHaveBeenCalled();
    });

    it("initializes app when config is loaded and app is not initialized", async () => {
      // Arrange
      const to = { query: {} } as unknown as Route;
      mockConfigStore.isLoaded = true;
      mockConfigStore.isAppInitialized = false;

      // Act
      await afterNavigationGuard(to);

      // Assert
      expect(initializeApp).toHaveBeenCalled();
      expect(mockConfigStore.markAsInitialized).toHaveBeenCalled();
    });

    it("waits for initializeApp to complete before marking as initialized", async () => {
      // Arrange
      const to = { query: {} } as unknown as Route;
      mockConfigStore.isLoaded = true;
      mockConfigStore.isAppInitialized = false;

      // Create a delayed promise to test async behavior
      let resolveInitPromise: (value?: unknown) => void = () => {
        /* This function will be replaced when the Promise is created */
      };
      const initPromise = new Promise((resolve) => {
        resolveInitPromise = resolve;
      });

      // Mock initializeApp to return our controlled promise
      (initializeApp as jest.Mock).mockReturnValue(initPromise);

      // Act
      const guardPromise = afterNavigationGuard(to);

      // Assert that markAsInitialized hasn't been called yet
      expect(mockConfigStore.markAsInitialized).not.toHaveBeenCalled();

      // Resolve the init promise
      resolveInitPromise();

      // Wait for navigation guard to complete
      await guardPromise;

      // Now markAsInitialized should have been called
      expect(mockConfigStore.markAsInitialized).toHaveBeenCalled();
    });
  });
});
