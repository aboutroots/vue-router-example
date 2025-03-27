import { isEqual } from "lodash-es";
import router from "@/router";

type QueryParams = Record<string, string | number | null | (string | null)[]>;
/**
 * Service responsible for updating URL query parameters.
 * Implements the Singleton pattern to ensure a single instance manages all URL updates.
 */
class QueryUpdater {
  private pendingUpdates: QueryParams = {};
  private oldParams: QueryParams | null = null;
  private updateTimeoutId: number | null = null;
  private readonly debounceTime = 50; // ms

  /**
   * Updates the URL query parameters without triggering a navigation.
   * Maintains existing parameters unless explicitly set to null.
   * Updates are batched within a 50ms window to avoid multiple URL changes.
   * @param newParams - Object containing key-value pairs of query parameters.
   */
  updateQueryParams(newParams: QueryParams, oldParams?: QueryParams): void {
    // Merge the new params with any pending updates
    this.pendingUpdates = {
      ...this.pendingUpdates,
      ...newParams,
    };
    this.oldParams = oldParams ?? null;

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
  private async applyPendingUpdates(): Promise<void> {
    // Start with existing query parameters
    const currentQuery = this.oldParams ?? { ...router.currentRoute.query };

    // Process pending updates
    Object.entries(this.pendingUpdates).forEach(([key, value]) => {
      if (value === null) {
        // Remove keys explicitly set to null
        delete currentQuery[key];
      } else {
        // Update or add other keys
        currentQuery[key] = String(value);
      }
    });

    // Only update if there are actual changes
    if (!isEqual(router.currentRoute.query, currentQuery)) {
      const sortedQuery = Object.fromEntries(
        // Sort the query parameters alphabetically
        Object.entries(currentQuery).sort(([a], [b]) => a.localeCompare(b))
      );

      router.replace({
        query: sortedQuery as Record<string, string | (string | null)[]>,
      });
    }

    // Reset the pending updates and timeout
    this.pendingUpdates = {};
    this.oldParams = null;
    this.updateTimeoutId = null;
  }
}

// Export a singleton instance
export const queryUpdater = new QueryUpdater();
