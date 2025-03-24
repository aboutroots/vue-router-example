<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6">
      <div class="mb-8">
        <label for="account-select" class="mr-3 font-semibold"
          >Select Account:</label
        >
        <select
          id="account-select"
          data-test="account-select"
          :value="currentAccountId"
          @change="handleAccountChangeEvent"
          class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
        >
          <option value="" disabled>Select an account</option>
          <option
            v-for="account in availableAccounts"
            :key="account.id"
            :value="account.id"
            data-test="account-option"
          >
            {{ account.name }}
          </option>
        </select>
      </div>

      <div v-if="hasCurrentAccount" class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4" data-test="account-heading">
          Users for {{ currentAccountName }}
        </h2>
        <p class="mb-4" data-test="total-users">Total: {{ usersListTotal }}</p>
        <div class="overflow-x-auto">
          <v-wait :for="WaitKey.FETCH_USERS">
            <template slot="waiting">
              <loading-spinner />
            </template>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avatar
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in usersList"
                  :key="user.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">
                      {{ user.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <img
                      :src="user.avatar"
                      :alt="user.first_name"
                      class="h-12 w-12 rounded-full"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </v-wait>

          <div
            v-if="usersListTotalPages > 1"
            class="mt-4 flex justify-center space-x-2"
          >
            <button
              v-for="page in usersListTotalPages"
              :key="page"
              @click="handlePageChange(page)"
              class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{
                'bg-blue-600 text-white': page === usersListPage,
                'bg-gray-200 text-gray-700 hover:bg-gray-300':
                  page !== usersListPage,
              }"
              data-test="page-button"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "pinia";
import { useAccountStore } from "@/stores/account";
import { useConfigStore } from "@/stores/config";
import { WaitKey } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { Account } from "@/types/api";

export default Vue.extend({
  name: "DashboardPanel",

  components: {
    LoadingSpinner,
  },

  computed: {
    ...mapState(useAccountStore, [
      "currentAccount",
      "usersList",
      "usersListPage",
      "usersListTotalPages",
      "usersListTotal",
    ]),

    ...mapState(useConfigStore, ["possibleAccounts"]),

    hasCurrentAccount(): boolean {
      return (
        this.currentAccount !== null && this.currentAccount.id !== undefined
      );
    },

    currentAccountName(): string {
      return this.currentAccount?.name || "";
    },

    currentAccountId(): string {
      return this.currentAccount?.id || "";
    },

    WaitKey: () => WaitKey,

    availableAccounts(): Account[] {
      return this.possibleAccounts;
    },
  },

  methods: {
    ...mapActions(useAccountStore, ["setAccount", "setUsersPage"]),

    handleAccountChangeEvent(event: Event): void {
      const selectElement = event.target as HTMLSelectElement;
      this.handleAccountChange(selectElement.value);
    },

    async handleAccountChange(accountId: string): Promise<void> {
      const account = this.availableAccounts.find(
        (acc) => acc.id === accountId
      );

      if (account) {
        await this.setAccount(account);
      }
    },

    async handlePageChange(page: number): Promise<void> {
      await this.setUsersPage(page);
    },
  },
});
</script>
