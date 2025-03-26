import { isArray } from "lodash-es";
import { Route } from "vue-router";
import router from "@/router";

/**
 * Service responsible for reading URL query parameters.
 * Implements the Singleton pattern to centralize all query parameter reading.
 */
class QueryReader {
  /**
   * Retrieves a specific query parameter from the current URL.
   * If the parameter is an array, it returns the first value.
   * @param key - The query parameter key to retrieve
   * @returns The value of the query parameter or null if not found
   */
  async getQueryParam(key: string): Promise<string | null> {
    const val = router.currentRoute.query[key] || null;
    if (isArray(val)) {
      return val[0] || null;
    }
    return val;
  }

  /**
   * Retrieves a specific query parameter from a provided route.
   * If the parameter is an array, it returns the first value.
   * @param route - The route to read from
   * @param key - The query parameter key to retrieve
   * @returns The value of the query parameter or null if not found
   */
  getQueryParamFromRoute(route: Route, key: string): string | null {
    const val = route.query[key] || null;
    if (isArray(val)) {
      return val[0] || null;
    }
    return val;
  }

  /**
   * Checks if the current URL has any query parameters.
   * @returns True if there are query parameters, false otherwise
   */
  async hasQueryParams(): Promise<boolean> {
    return Object.keys(router.currentRoute.query).length > 0;
  }

  /**
   * Checks if a route has any query parameters.
   * @param route - The route to check
   * @returns True if there are query parameters, false otherwise
   */
  routeHasQueryParams(route: Route): boolean {
    return Object.keys(route.query).length > 0;
  }

  /**
   * Gets all query parameters from the current URL.
   * @returns An object containing all query parameters
   */
  async getAllQueryParams(): Promise<
    Record<string, string | (string | null)[] | null>
  > {
    return { ...router.currentRoute.query };
  }

  /**
   * Gets all query parameters from a provided route.
   * @param route - The route to read from
   * @returns An object containing all query parameters
   */
  getAllQueryParamsFromRoute(
    route: Route
  ): Record<string, string | (string | null)[] | null> {
    return { ...route.query };
  }
}

// Export a singleton instance
export const queryReader = new QueryReader();
