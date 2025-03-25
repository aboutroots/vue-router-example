<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold mb-3 text-gray-800">Control Panel</h3>
    <div class="flex flex-col gap-4">
      <!-- Account selector -->
      <h4 class="text-lg font-semibold text-gray-800">Account</h4>
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
      <h4 class="text-lg font-semibold text-gray-800">Special Mode</h4>
      <div class="flex flex-col gap-2">
        <div class="flex rounded-lg bg-gray-100 p-2">
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
        <button
          v-if="currentMode"
          @click="unsetMode"
          class="inline-block py-2 px-4 bg-transparent text-gray-800 border border-gray-800 rounded-md hover:bg-gray-100 transition-colors text-sm"
          data-test="unset-mode-button"
        >
          Unset
        </button>
      </div>

      <!-- Action buttons -->
      <h4 class="text-lg font-semibold text-gray-800">Modals</h4>
      <div class="flex gap-3">
        <button
          v-for="(modal, index) in modals"
          :key="modal"
          @click="openModal(index + 1)"
          class="inline-block py-2 px-4 bg-transparent text-gray-800 border border-gray-800 rounded-md hover:bg-gray-100 transition-colors"
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
import { useModalStore } from "@/stores/modals";

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
    ...mapActions(useSpecialModeStore, ["setMode", "clearMode"]),

    async selectAccount(account: Account): Promise<void> {
      await this.setAccount(account);
    },

    selectMode(mode: SpecialModeType): void {
      this.setMode(mode);
    },

    unsetMode(): void {
      this.clearMode();
    },

    openModal(modalNumber: number) {
      if (modalNumber === 1) {
        this.openUserDetailsModal();
      } else if (modalNumber === 2) {
        this.openConfirmationModal();
      }
    },

    openUserDetailsModal() {
      const modalStore = useModalStore();

      modalStore.openModal("user-details", {
        props: { userId: 123, userName: "John Doe" },
      });
    },

    // Or open a confirmation modal
    openConfirmationModal() {
      const modalStore = useModalStore();

      modalStore.openModal("confirmation", {
        props: {
          title: "Perform Destructive Action",
          message:
            "Are you sure you want to perform some destructive action? This action cannot be undone.",
        },
        eventListeners: {
          confirm: () => {
            console.log(
              "Confirmed! - this is being called from the control panel"
            );
          },
          cancel: () => {
            console.log(
              "Canceled! - this is being called from the control panel"
            );
          },
        },
      });
    },
  },
});
</script>
