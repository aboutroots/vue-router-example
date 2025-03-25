<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="text-lg font-semibold mb-3 text-gray-800">
      Favorite Users - loaded on demand
    </h3>
    <button
      @click="toggleExpand"
      data-test="toggle-button"
      class="w-full py-2 px-4 bg-transparent text-gray-800 border border-gray-800 rounded-md hover:bg-gray-100 transition-colors mb-4"
    >
      {{ isExpanded ? "Hide Favorite Users" : "Click to Show Favorite Users" }}
    </button>

    <div v-if="isExpanded" data-test="expanded-content">
      <v-wait :for="WaitKey">
        <template slot="waiting">
          <div class="flex justify-center my-4" data-test="loading-indicator">
            <loading-spinner />
          </div>
        </template>
        <div v-if="favoriteUsers.length > 0" data-test="users-table-container">
          <h3 class="text-lg font-semibold mb-3 text-gray-800">
            Favorite Users
          </h3>
          <table class="min-w-full" data-test="users-table">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Avatar
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="user in favoriteUsers"
                :key="user.id"
                data-test="user-row"
              >
                <td
                  class="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                  data-test="user-name"
                >
                  {{ user.first_name }} {{ user.last_name }}
                </td>
                <td
                  class="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                  data-test="user-email"
                >
                  {{ user.email }}
                </td>
                <td
                  class="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
                  data-test="user-avatar"
                >
                  <img
                    :src="user.avatar"
                    :alt="user.first_name"
                    class="h-12 w-12 rounded-full"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else
          class="text-center text-gray-500 py-4"
          data-test="empty-message"
        >
          No favorite users found
        </div>
      </v-wait>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "pinia";
import { useAccountStore } from "@/stores/account";
import { WaitKey } from "@/constants";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default Vue.extend({
  name: "FavoriteUsers",

  components: {
    LoadingSpinner,
  },

  data() {
    return {
      isExpanded: false,
    };
  },

  computed: {
    ...mapState(useAccountStore, [
      "favoriteUsers",
      "favoriteUsersFetched",
      "currentAccount",
    ]),
    WaitKey: () => WaitKey.FETCH_FAVORITE_USERS,
  },

  methods: {
    ...mapActions(useAccountStore, [
      "fetchFavoriteUsers",
      "clearFavoriteUsers",
    ]),

    async toggleExpand() {
      this.isExpanded = !this.isExpanded;

      // Load favorite users if expanded and not already loaded
      if (
        this.isExpanded &&
        !this.favoriteUsersFetched &&
        this.currentAccount
      ) {
        await this.fetchFavoriteUsers();
      }
    },
  },

  beforeDestroy() {
    // Clear favorite users when component is destroyed
    this.clearFavoriteUsers();
  },
});
</script>
