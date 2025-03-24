import router from "@/router";
import { isArray, isEqual } from "lodash-es";

/**
 * Service responsible for managing URL query parameters.
 * Implements the Singleton pattern to ensure a single instance manages all URL updates.
 */
class QueryParser {
  private pendingUpdates: Record<string, number | string | null> = {};
  private updateTimeoutId: number | null = null;
  private readonly debounceTime = 50; // ms

  /**
   * Sets the URL query parameters without triggering a navigation.
   * Updates are batched within a 50ms window to avoid multiple URL changes.
   * @param params - Object containing key-value pairs of query parameters.
   */
  setQueryParams(params: Record<string, number | string | null>): void {
    // Merge the new params with any pending updates
    this.pendingUpdates = {
      ...this.pendingUpdates,
      ...params,
    };

    // Clear any existing timeout
    if (this.updateTimeoutId !== null) {
      window.clearTimeout(this.updateTimeoutId);
    }

    // Schedule a new update
    this.updateTimeoutId = window.setTimeout(() => {
      this.applyPendingUpdates();
    }, this.debounceTime);
  }

  /**
   * Apply all pending query parameter updates at once
   */
  private applyPendingUpdates(): void {
    const currentQuery = { ...router.currentRoute.query };

    // Filter out null/undefined values and stringify remaining values
    const newQuery = Object.entries(this.pendingUpdates).reduce(
      (acc, [key, value]) => {
        if (value != null) {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>
    );

    // Only update if there are actual changes
    if (!isEqual(currentQuery, newQuery)) {
      router.replace({
        query: newQuery,
      });
    }

    // Reset the pending updates and timeout
    this.pendingUpdates = {};
    this.updateTimeoutId = null;
  }

  /**
   * Retrieves a specific query parameter from the current URL.
   * If the parameter is an array, it returns the first value.
   * @param key - The query parameter key to retrieve
   * @returns The value of the query parameter or null if not found
   */
  getQueryParam(key: string): string | null {
    const val = router.currentRoute.query[key] || null;
    if (isArray(val)) {
      return val[0] || null;
    }
    return val;
  }
}

// Export a singleton instance
export const queryParser = new QueryParser();
