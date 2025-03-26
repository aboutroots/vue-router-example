import { Route } from "vue-router";
import { SpecialModeType } from "@/stores/specialMode";
import { queryUpdater } from "@/services/QueryUpdater";
import { queryReader } from "@/services/QueryReader";
import { Account } from "@/types/api";

/**
 * This class is responsible for synchronizing URL query parameters with their respective stores.
 * It's used by navigation guards to update store state when URL parameters change.
 */
class QueryParamSynchronizer {
  private isProcessing = false;

  /**
   * Process query parameters from a route and update relevant stores.
   * @param route The route containing query parameters to process
   * @param options Options to control how parameters are processed
   * @returns Promise that resolves when all parameter processing is complete
   */
  async processQueryParams(
    route: Route,
    options: { updateUrl?: boolean } = { updateUrl: false }
  ): Promise<void> {
    // Prevent loops during processing. Note that this works because this is
    // a singleton instance.
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;

      const promises: Promise<any>[] = [];
      const normalizedParams: Record<string, string | null> = {};
      const needsUrlUpdate = options.updateUrl;

      // Process all parameters that have handlers
      if (route.query.accountId !== undefined) {
        const promise = this.processAccountIdParam(route, normalizedParams);
        if (promise) promises.push(promise);
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

      // Wait for all promises to complete
      await Promise.all(promises);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process the accountId parameter and update the account store if needed.
   * @param route The route containing the query parameter
   * @param normalizedParams Object to store any normalized parameters
   * @returns Promise or undefined if no action was taken
   */
  private async processAccountIdParam(
    route: Route,
    normalizedParams: Record<string, string | null>
  ): Promise<boolean | undefined> {
    const accountId = queryReader.getQueryParamFromRoute(route, "accountId");
    if (!accountId) return undefined;

    // Dynamic imports to avoid circular dependencies
    const { useAccountStore } = await import("@/stores/account");
    const { useConfigStore } = await import("@/stores/config");

    const accountStore = useAccountStore();
    const configStore = useConfigStore();

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

  /**
   * Process the specialMode parameter and update the specialMode store if needed.
   * @param route The route containing the query parameter
   * @param normalizedParams Object to store any normalized parameters
   */
  private async processSpecialModeParam(
    route: Route,
    normalizedParams: Record<string, string | null>
  ): Promise<void> {
    const specialModeValue = queryReader.getQueryParamFromRoute(
      route,
      "specialMode"
    );

    // Dynamic import to avoid circular dependencies
    const { useSpecialModeStore } = await import("@/stores/specialMode");
    const specialModeStore = useSpecialModeStore();

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

// Export a singleton instance.
// In JavaScript/TypeScript, a singleton instance like this will be shared across all imports.
// This is because:
// - When a module is first imported, it is evaluated and initialized only once.
// - The exported instance is the same object reference across all imports.
export const queryParamSynchronizer = new QueryParamSynchronizer();
