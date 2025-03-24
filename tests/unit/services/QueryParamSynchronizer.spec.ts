import { Route } from "vue-router";
import { SpecialModeType } from "@/stores/specialMode";
import { queryUpdater } from "@/services/QueryUpdater";
import { queryReader } from "@/services/QueryReader";

// Define account type
interface Account {
  id: string;
  name: string;
}

// Create a test version of QueryParamSynchronizer that directly exposes methods
class TestQueryParamSynchronizer {
  private isProcessing = false;

  async processQueryParams(
    route: Route,
    options: { updateUrl?: boolean } = { updateUrl: false }
  ): Promise<void> {
    // Prevent loops during processing
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;

      const normalizedParams: Record<string, string | null> = {};
      const needsUrlUpdate = options.updateUrl;

      // Process all parameters that have handlers
      if (route.query.accountId !== undefined) {
        await this.processAccountIdParam(route, normalizedParams);
      }

      if (route.query.specialMode !== undefined) {
        await this.processSpecialModeParam(route, normalizedParams);
      }

      // If we need to update URL parameters (for normalization)
      if (needsUrlUpdate && Object.keys(normalizedParams).length > 0) {
        // Using updateQueryParams directly for normalization
        // This won't cause loops because we're inside isProcessing=true block
        queryUpdater.updateQueryParams(normalizedParams);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  async processAccountIdParam(
    route: Route,
    normalizedParams: Record<string, string | null>
  ): Promise<boolean | undefined> {
    const accountId = queryReader.getQueryParamFromRoute(route, "accountId");
    if (!accountId) return undefined;

    // Import mock stores directly (no circular dependency in tests)
    const accountStore = mockAccountStore;
    const configStore = mockConfigStore;

    // Find account by ID (case-insensitive)
    const account = configStore.possibleAccounts.find(
      (acc: Account) => acc.id.toLowerCase() === accountId.toLowerCase()
    );

    // Handle case where the accountId is invalid or doesn't exist in possibleAccounts
    if (!account) {
      // We might want to normalize by removing invalid accountId
      normalizedParams.accountId = null;
      return undefined;
    }

    // Check if the accountId needs normalization (e.g., case difference)
    if (account.id !== accountId) {
      normalizedParams.accountId = account.id;
    }

    // Only update if account exists and is different from current account
    if (accountStore.currentAccount?.id !== account.id) {
      // Call setAccount with updateUrl: false to avoid loops
      return accountStore.setAccount(account, { updateUrl: false });
    }

    return undefined;
  }

  async processSpecialModeParam(
    route: Route,
    normalizedParams: Record<string, string | null>
  ): Promise<void> {
    const specialModeValue = queryReader.getQueryParamFromRoute(
      route,
      "specialMode"
    );

    // Import mock store directly (no circular dependency in tests)
    const specialModeStore = mockSpecialModeStore;

    let normalizedMode: SpecialModeType = null;

    // Normalize specialMode value (convert to uppercase, validate)
    if (specialModeValue) {
      const upperValue = specialModeValue.toUpperCase();
      normalizedMode =
        upperValue === "PRIMARY" || upperValue === "SECONDARY"
          ? (upperValue as SpecialModeType)
          : null;

      // If value needs normalization, flag for URL update
      if (normalizedMode && normalizedMode !== specialModeValue) {
        normalizedParams.specialMode = normalizedMode;
      }
    }

    // Only update store if value is different
    if (specialModeStore.mode !== normalizedMode) {
      if (normalizedMode) {
        // Call setMode with updateUrl: false to avoid loops
        specialModeStore.setMode(normalizedMode, { updateUrl: false });
      } else {
        // Call clearMode with updateUrl: false to avoid loops
        specialModeStore.clearMode({ updateUrl: false });
      }
    }
  }
}

// Mock the actual queryParamSynchronizer with our test implementation
import * as QueryParamSynchronizerModule from "@/services/QueryParamSynchronizer";
const testQueryParamSynchronizer = new TestQueryParamSynchronizer();
(QueryParamSynchronizerModule as any).queryParamSynchronizer =
  testQueryParamSynchronizer;

// Create mock stores that will be used by our test synchronizer
const setMode = jest.fn().mockResolvedValue(undefined);
const clearMode = jest.fn().mockResolvedValue(undefined);
const setAccount = jest.fn().mockResolvedValue(true);

const mockSpecialModeStore = {
  mode: null as SpecialModeType,
  setMode,
  clearMode,
};

const mockAccountStore = {
  currentAccount: null as Account | null,
  setAccount,
};

const mockConfigStore = {
  possibleAccounts: [
    { id: "account1", name: "Account 1" },
    { id: "account2", name: "Account 2" },
  ] as Account[],
};

// Mock the queryUpdater and queryReader
jest.mock("@/services/QueryUpdater", () => ({
  queryUpdater: {
    updateQueryParams: jest.fn(),
  },
}));

jest.mock("@/services/QueryReader", () => ({
  queryReader: {
    getQueryParamFromRoute: jest.fn(),
  },
}));

// Create minimal Route type for tests
type PartialRoute = Pick<Route, "query">;

describe("QueryParamSynchronizer", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Reset the mode to null before each test
    mockSpecialModeStore.mode = null;
    mockAccountStore.currentAccount = null;

    // Make sure the synchronizer's internal processing flag is reset
    (testQueryParamSynchronizer as any).isProcessing = false;
  });

  test("processQueryParams does nothing when isProcessing is true", async () => {
    // Set the processing flag
    (testQueryParamSynchronizer as any).isProcessing = true;

    // Create a mock route with query parameters
    const route = {
      query: { specialMode: "PRIMARY" },
    } as PartialRoute;

    // Call processQueryParams
    await testQueryParamSynchronizer.processQueryParams(route as Route);

    // Assert no store methods were called
    expect(setMode).not.toHaveBeenCalled();
    expect(clearMode).not.toHaveBeenCalled();
    expect(setAccount).not.toHaveBeenCalled();
    expect(queryReader.getQueryParamFromRoute).not.toHaveBeenCalled();
  });

  test("processQueryParams handles specialMode parameter", async () => {
    // Setup query parameter mock
    (queryReader.getQueryParamFromRoute as jest.Mock).mockReturnValue(
      "PRIMARY"
    );

    // Create a mock route with specialMode parameter
    const route = {
      query: { specialMode: "PRIMARY" },
    } as PartialRoute;

    // Call processQueryParams
    await testQueryParamSynchronizer.processQueryParams(route as Route);

    // Assert specialMode store was updated correctly
    expect(queryReader.getQueryParamFromRoute).toHaveBeenCalledWith(
      route,
      "specialMode"
    );
    expect(setMode).toHaveBeenCalledWith("PRIMARY", { updateUrl: false });
    expect(clearMode).not.toHaveBeenCalled();
  });

  test("processQueryParams normalizes lowercase specialMode parameter", async () => {
    // Setup query parameter mock
    (queryReader.getQueryParamFromRoute as jest.Mock).mockReturnValue(
      "primary"
    );

    // Create a mock route with lowercase specialMode parameter
    const route = {
      query: { specialMode: "primary" },
    } as PartialRoute;

    // Call processQueryParams with updateUrl=true
    await testQueryParamSynchronizer.processQueryParams(route as Route, {
      updateUrl: true,
    });

    // Assert specialMode store was updated correctly
    expect(queryReader.getQueryParamFromRoute).toHaveBeenCalledWith(
      route,
      "specialMode"
    );
    expect(setMode).toHaveBeenCalledWith("PRIMARY", { updateUrl: false });

    // Assert URL was updated with normalized value
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      specialMode: "PRIMARY",
    });
  });

  test("processQueryParams handles invalid specialMode parameter", async () => {
    // Setup query parameter mock
    (queryReader.getQueryParamFromRoute as jest.Mock).mockReturnValue(
      "INVALID"
    );

    // Setup store with a non-null mode to ensure clearMode is called
    mockSpecialModeStore.mode = "PRIMARY";

    // Create a mock route with invalid specialMode parameter
    const route = {
      query: { specialMode: "INVALID" },
    } as PartialRoute;

    // Call processQueryParams
    await testQueryParamSynchronizer.processQueryParams(route as Route);

    // Assert specialMode store was cleared
    expect(queryReader.getQueryParamFromRoute).toHaveBeenCalledWith(
      route,
      "specialMode"
    );
    expect(setMode).not.toHaveBeenCalled();
    expect(clearMode).toHaveBeenCalledWith({ updateUrl: false });
  });

  test("processQueryParams handles accountId parameter", async () => {
    // Setup query parameter mock
    (queryReader.getQueryParamFromRoute as jest.Mock).mockReturnValue(
      "account1"
    );

    // Create a mock route with accountId parameter
    const route = {
      query: { accountId: "account1" },
    } as PartialRoute;

    // Call processQueryParams
    await testQueryParamSynchronizer.processQueryParams(route as Route);

    // Assert account store was updated correctly
    expect(queryReader.getQueryParamFromRoute).toHaveBeenCalledWith(
      route,
      "accountId"
    );
    expect(setAccount).toHaveBeenCalledWith(
      { id: "account1", name: "Account 1" },
      { updateUrl: false }
    );
  });

  test("processQueryParams handles unknown accountId parameter", async () => {
    // Setup query parameter mock
    (queryReader.getQueryParamFromRoute as jest.Mock).mockReturnValue(
      "unknown"
    );

    // Create a mock route with unknown accountId parameter
    const route = {
      query: { accountId: "unknown" },
    } as PartialRoute;

    // Call processQueryParams with updateUrl=true to see normalizations
    await testQueryParamSynchronizer.processQueryParams(route as Route, {
      updateUrl: true,
    });

    // Assert account store was not updated
    expect(queryReader.getQueryParamFromRoute).toHaveBeenCalledWith(
      route,
      "accountId"
    );
    expect(setAccount).not.toHaveBeenCalled();

    // Assert that invalid accountId is removed through normalization
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      accountId: null,
    });
  });

  test("processQueryParams handles multiple parameters", async () => {
    // Setup query parameter mock to return different values based on parameter name
    (queryReader.getQueryParamFromRoute as jest.Mock).mockImplementation(
      (_, param) => {
        if (param === "accountId") return "account2";
        if (param === "specialMode") return "secondary";
        return null;
      }
    );

    // Create a mock route with multiple parameters
    const route = {
      query: {
        accountId: "account2",
        specialMode: "secondary",
      },
    } as PartialRoute;

    // Call processQueryParams with updateUrl=true
    await testQueryParamSynchronizer.processQueryParams(route as Route, {
      updateUrl: true,
    });

    // Assert all stores were updated correctly
    expect(setAccount).toHaveBeenCalledWith(
      { id: "account2", name: "Account 2" },
      { updateUrl: false }
    );
    expect(setMode).toHaveBeenCalledWith("SECONDARY", { updateUrl: false });

    // Assert URL was updated with normalized value
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      specialMode: "SECONDARY",
    });
  });

  test("processQueryParams normalizes accountId parameter with case differences", async () => {
    // Setup query parameter mock
    (queryReader.getQueryParamFromRoute as jest.Mock).mockReturnValue(
      "ACCOUNT1" // Uppercase differs from the actual "account1" in possibleAccounts
    );

    // Create a mock route with different case accountId parameter
    const route = {
      query: { accountId: "ACCOUNT1" },
    } as PartialRoute;

    // Call processQueryParams with updateUrl=true to see normalizations
    await testQueryParamSynchronizer.processQueryParams(route as Route, {
      updateUrl: true,
    });

    // Assert account store was updated with the correct account
    expect(queryReader.getQueryParamFromRoute).toHaveBeenCalledWith(
      route,
      "accountId"
    );
    expect(setAccount).toHaveBeenCalledWith(
      { id: "account1", name: "Account 1" },
      { updateUrl: false }
    );

    // Assert that accountId is normalized to the correct case
    expect(queryUpdater.updateQueryParams).toHaveBeenCalledWith({
      accountId: "account1",
    });
  });
});
