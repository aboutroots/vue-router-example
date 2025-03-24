import { Route } from "vue-router";
import { queryParamSynchronizer } from "@/services/QueryParamSynchronizer";
import { queryReader } from "@/services/QueryReader";

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

// Import router after mocking dependencies to ensure mocks are in place
import router from "@/router";

// Define the navigation guard type
type NavigationGuard = (
  to: Route,
  from: Route,
  next: (to?: any) => void
) => void;

describe("Router navigation guards", () => {
  let navigationGuard: NavigationGuard;
  let next: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup next mock
    next = jest.fn();

    // Extract the navigation guard function from router
    // We need to get access to the navigation guard that was registered with beforeEach
    navigationGuard = (router as any).beforeHooks[0];
  });

  it("calls next without processing query params when there are no query parameters", async () => {
    // Arrange
    const to = { query: {} } as unknown as Route;
    const from = { query: {} } as unknown as Route;

    // Mock queryReader to return false (no query params)
    (queryReader.routeHasQueryParams as jest.Mock).mockReturnValue(false);

    // Act
    await navigationGuard(to, from, next);

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

    // Mock queryReader to return true (has query params)
    (queryReader.routeHasQueryParams as jest.Mock).mockReturnValue(true);

    // Act
    await navigationGuard(to, from, next);

    // Assert
    expect(queryReader.routeHasQueryParams).toHaveBeenCalledWith(to);
    expect(queryParamSynchronizer.processQueryParams).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("processes query params when query params exist and have changed", async () => {
    // Arrange
    const to = { query: { page: "2" } } as unknown as Route;
    const from = { query: { page: "1" } } as unknown as Route;

    // Mock queryReader to return true (has query params)
    (queryReader.routeHasQueryParams as jest.Mock).mockReturnValue(true);

    // Act
    await navigationGuard(to, from, next);

    // Assert
    expect(queryReader.routeHasQueryParams).toHaveBeenCalledWith(to);
    expect(queryParamSynchronizer.processQueryParams).toHaveBeenCalledWith(to, {
      updateUrl: true,
    });
    expect(next).toHaveBeenCalled();
  });

  it("waits for processQueryParams to complete before calling next", async () => {
    // Arrange
    const to = { query: { page: "2" } } as unknown as Route;
    const from = { query: { page: "1" } } as unknown as Route;

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
    const guardPromise = navigationGuard(to, from, next);

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
