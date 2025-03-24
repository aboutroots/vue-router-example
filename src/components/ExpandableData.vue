<template>
  <div class="bg-white rounded-lg shadow p-4">
    <button
      @click="toggleExpand"
      class="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mb-4"
    >
      {{ isExpanded ? "Hide data" : "Click me to load data on demand" }}
    </button>

    <div v-if="isExpanded">
      <table class="min-w-full">
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
              Role
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              {{ user.name }}
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              {{ user.role }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default Vue.extend({
  name: "ExpandableData",

  data() {
    return {
      isExpanded: false,
      users: [] as User[],
    };
  },

  methods: {
    async toggleExpand() {
      if (!this.isExpanded) {
        // Load data only when expanding
        this.users = [
          { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "User",
          },
          {
            id: 3,
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "Editor",
          },
        ];
      }
      this.isExpanded = !this.isExpanded;
    },
  },
});
</script>
