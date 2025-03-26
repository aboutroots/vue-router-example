import { WaitKey } from "@/constants";
import configAPI from "@/services/api/resources/config";
import { Config } from "@/types/api";
import { defineStore } from "pinia";

interface ConfigState extends Config {
  isLoaded: boolean;
  isAppInitialized: boolean;
}

export const useConfigStore = defineStore("config", {
  state: (): ConfigState => ({
    defaultAccountId: "",
    possibleAccounts: [],
    // Whether the config has been loaded from the server
    isLoaded: false,
    // Whether the app has been initialized with default values
    // (must be done after config is loaded)
    isAppInitialized: false,
  }),

  actions: {
    async loadConfig() {
      try {
        this.$wait.start(WaitKey.FETCH_CONFIG);
        const response = await configAPI.getConfig();
        this.defaultAccountId = response.defaultAccountId;
        this.possibleAccounts = response.possibleAccounts;
        this.isLoaded = true;
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        this.$wait.end(WaitKey.FETCH_CONFIG);
      }
    },

    markAsInitialized() {
      if (!this.isLoaded) {
        throw new Error("Config is not loaded, could not mark as initialized");
      }
      this.isAppInitialized = true;
    },
  },
});
