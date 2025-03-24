import { defineStore } from "pinia";
import { queryUpdater } from "@/services/QueryUpdater";

export type SpecialModeType = "PRIMARY" | "SECONDARY" | null;

interface SpecialModeState {
  mode: SpecialModeType;
}

export const useSpecialModeStore = defineStore("specialMode", {
  state: (): SpecialModeState => ({
    mode: null,
  }),

  actions: {
    /**
     * Sets the special mode value.
     * @param mode The new special mode value
     * @param options Options to control whether the URL should be updated
     */
    setMode(
      mode: SpecialModeType,
      options: { updateUrl?: boolean } = { updateUrl: true }
    ): void {
      this.mode = mode;

      // Update URL with specialMode parameter if updateUrl is true
      if (options.updateUrl) {
        queryUpdater.updateQueryParams({ specialMode: mode });
      }
    },

    /**
     * Clears the special mode value.
     * @param options Options to control whether the URL should be updated
     */
    clearMode(options: { updateUrl?: boolean } = { updateUrl: true }): void {
      this.mode = null;

      // Remove specialMode parameter from URL if updateUrl is true
      if (options.updateUrl) {
        queryUpdater.updateQueryParams({ specialMode: null });
      }
    },
  },
});
