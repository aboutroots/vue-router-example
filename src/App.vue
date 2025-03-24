<template>
  <div id="app">
    <AppLayout />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppLayout from "@/components/AppLayout.vue";
import { useConfigStore } from "./stores/config";
import { mapState, mapActions } from "pinia";
import { queryParamSynchronizer } from "@/services/QueryParamSynchronizer";
import { queryReader } from "@/services/QueryReader";
import router from "./router";

export default Vue.extend({
  name: "App",
  components: {
    AppLayout,
  },

  computed: {
    ...mapState(useConfigStore, ["defaultAccountId", "possibleAccounts"]),
  },

  methods: {
    ...mapActions(useConfigStore, ["loadConfig"]),

    async setDefaultAccount() {
      if (this.defaultAccountId && this.possibleAccounts.length > 0) {
        const defaultAccount = this.possibleAccounts.find(
          (acc) => acc.id === this.defaultAccountId
        );

        if (defaultAccount) {
          try {
            // Import the account store dynamically to avoid circular dependency
            const { useAccountStore } = await import("./stores/account");
            const accountStore = useAccountStore();

            // Only set default account if there's no account already set (e.g., from URL params)
            if (!accountStore.currentAccount) {
              await accountStore.setAccount(defaultAccount);
            }
          } catch (error) {
            console.error("Failed to set default account:", error);
          }
        }
      }
    },

    async processInitialQueryParams() {
      // Process URL parameters if any exist
      const hasQueryParams = await queryReader.hasQueryParams();
      if (hasQueryParams) {
        await queryParamSynchronizer.processQueryParams(router.currentRoute, {
          updateUrl: true,
        });
      }
    },
  },

  async created() {
    // 1. Load configuration first
    await this.loadConfig();

    // 2. Process URL parameters
    await this.processInitialQueryParams();

    // 3. Set default account if needed (won't override if account was set from URL)
    await this.setDefaultAccount();
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  height: 100vh;
}
</style>
