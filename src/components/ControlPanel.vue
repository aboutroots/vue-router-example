<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold mb-3">Control Panel</h3>
    <div class="flex flex-col gap-4">
      <!-- Account selector -->
      <h4 class="text-lg font-semibold">Account</h4>
      <div class="flex rounded-lg bg-gray-100 p-2 mb-4">
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

      <!-- Special Mode selector -->
      <h4 class="text-lg font-semibold">Special Mode</h4>
      <div class="flex rounded-lg bg-gray-100 p-2 mb-4">
        <button
          v-for="mode in specialModes"
          :key="mode"
          @click="selectMode(mode)"
          class="flex-1 py-2 px-4 rounded-md transition-colors text-sm"
          :class="{
            'bg-white shadow text-gray-800': currentMode === mode,
            'text-gray-600 hover:bg-gray-200': currentMode !== mode,
          }"
          data-test="special-mode-button"
        >
          {{ mode }}
        </button>
      </div>

      <!-- Action buttons -->
      <h4 class="text-lg font-semibold">Modals</h4>
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
import { useSpecialModeStore } from "@/stores/specialMode";
import { Account } from "@/types/api";
import { SpecialModeType } from "@/stores/specialMode";

export default Vue.extend({
  name: "ControlPanel",

  data() {
    return {
      modals: ["Modal 1", "Modal 2"],
      specialModes: ["PRIMARY", "SECONDARY"] as const,
    };
  },

  computed: {
    ...mapState(useAccountStore, ["currentAccount"]),
    ...mapState(useConfigStore, ["possibleAccounts"]),
    ...mapState(useSpecialModeStore, ["mode"]),

    availableAccounts(): Account[] {
      return this.possibleAccounts;
    },

    currentAccountId(): string {
      return this.currentAccount?.id || "";
    },

    currentMode(): SpecialModeType {
      return this.mode;
    },
  },

  methods: {
    ...mapActions(useAccountStore, ["setAccount"]),
    ...mapActions(useSpecialModeStore, ["setMode"]),

    async selectAccount(account: Account): Promise<void> {
      await this.setAccount(account);
    },

    selectMode(mode: SpecialModeType): void {
      this.setMode(mode);
    },

    openModal(modalNumber: number) {
      // TODO: Implement modal functionality
      console.log(`Opening modal ${modalNumber}`);
    },
  },
});
</script>
