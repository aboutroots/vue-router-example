import router from "@/router";
import { isArray, isEqual } from "lodash-es";

/**
 * Service responsible for managing URL query parameters.
 * Implements the Singleton pattern to ensure a single instance manages all URL updates.
 */
class QueryParser {
  /**
   * Sets the URL query parameters without triggering a navigation
   * @param params - Object containing key-value pairs of query parameters.
   */
  setQueryParams(params: Record<string, number | string | null>): void {
    const currentQuery = { ...router.currentRoute.query };

    // Filter out null/undefined values and stringify remaining values
    const newQuery = Object.entries(params).reduce((acc, [key, value]) => {
      if (value != null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>);

    // Only update if there are actual changes
    if (!isEqual(currentQuery, newQuery)) {
      router.replace({
        query: newQuery,
      });
    }
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
