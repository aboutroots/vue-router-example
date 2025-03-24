<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex flex-col gap-4">
      <!-- Account selector -->
      <div class="flex rounded-lg bg-gray-100 p-1">
        <button
          v-for="account in availableAccounts"
          :key="account.id"
          @click="selectAccount(account)"
          class="flex-1 py-2 px-4 rounded-md transition-colors text-sm"
          :class="{
            'bg-white shadow text-gray-800': currentAccountId === account.id,
            'text-gray-600 hover:bg-gray-200': currentAccountId !== account.id,
          }"
          data-test="account-selector-button"
        >
          {{ account.name }}
        </button>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3">
        <button
          v-for="(modal, index) in modals"
          :key="modal"
          @click="openModal(index + 1)"
          class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {{ modal }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "pinia";
import { useAccountStore } from "@/stores/account";
import { useConfigStore } from "@/stores/config";
import { Account } from "@/types/api";

export default Vue.extend({
  name: "AccountSelector",

  data() {
    return {
      modals: ["Modal 1", "Modal 2"],
    };
  },

  computed: {
    ...mapState(useAccountStore, ["currentAccount"]),
    ...mapState(useConfigStore, ["possibleAccounts"]),

    availableAccounts(): Account[] {
      return this.possibleAccounts;
    },

    currentAccountId(): string {
      return this.currentAccount?.id || "";
    },
  },

  methods: {
    ...mapActions(useAccountStore, ["setAccount"]),

    async selectAccount(account: Account): Promise<void> {
      await this.setAccount(account);
    },

    openModal(modalNumber: number) {
      // TODO: Implement modal functionality
      console.log(`Opening modal ${modalNumber}`);
    },
  },
});
</script>
