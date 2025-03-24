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
            await accountStore.setAccount(defaultAccount);
          } catch (error) {
            console.error("Failed to set default account:", error);
          }
        }
      }
    },
  },

  async created() {
    await this.loadConfig();
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
