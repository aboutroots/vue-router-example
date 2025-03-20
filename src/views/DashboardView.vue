<template>
  <div class="p-6">
    <div class="mb-8">
      <label for="account-select" class="mr-3 font-semibold"
        >Select Account:</label
      >
      <select
        id="account-select"
        v-model="selectedAccountId"
        @change="handleAccountChange"
        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
      >
        <option value="">Select an account</option>
        <option
          v-for="account in availableAccounts"
          :key="account.id"
          :value="account.id"
        >
          {{ account.name }}
        </option>
      </select>
    </div>

    <div v-if="currentAccount.id" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">
        Users for {{ currentAccount.name }}
      </h2>
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
                v-for="user in accountUsers"
                :key="user.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.first_name }} {{ user.last_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "pinia";
import { useAccountStore } from "@/stores/account";
import { WaitKey } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

interface Account {
  id: string;
  name: string;
}

interface ComponentData {
  selectedAccountId: string;
}

export default Vue.extend({
  name: "DashboardView",

  components: {
    LoadingSpinner,
  },

  data(): ComponentData {
    return {
      selectedAccountId: "",
    };
  },

  computed: {
    ...mapState(useAccountStore, ["currentAccount", "accountUsers"]),

    WaitKey: () => WaitKey,

    availableAccounts(): Account[] {
      // hardcoded for this demo.
      return [
        { id: "d1f9f052-62c2-4d72-8c2d-36dc04ad6ba0", name: "Account 1" },
        { id: "c4a6d606-ead3-462c-bc14-ef1fde44228b", name: "Account 2" },
        { id: "d9a95ed9-b62a-4a0c-857d-abadc94bb7b2", name: "Account 3" },
      ];
    },
  },

  methods: {
    ...mapActions(useAccountStore, ["setAccount"]),

    async handleAccountChange(): Promise<void> {
      const account = this.availableAccounts.find(
        (acc) => acc.id === this.selectedAccountId
      );
      if (account) {
        await this.setAccount(account);
      }
    },
  },
});
</script>
