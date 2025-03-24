import { defineStore } from "pinia";
import usersApi from "@/services/api/resources/users";
import { User } from "@/types/api";
import { WaitKey } from "@/constants";
import { queryParser } from "@/services/QueryParser";

interface Account {
  id: string;
  name: string;
}

interface AccountState {
  currentAccount: Account | null;
  usersList: User[];
  usersListPage: number;
  usersListTotalPages: number;
  usersListTotal: number;
}

export const useAccountStore = defineStore("account", {
  state: (): AccountState => ({
    currentAccount: null,
    usersList: [],
    usersListPage: 1,
    usersListTotalPages: 1,
    usersListTotal: 0,
  }),

  actions: {
    async setAccount(account: Account) {
      this.currentAccount = account;
      this.usersList = [];
      this.usersListPage = 1;

      // Update URL with account ID
      queryParser.setQueryParams({ accountId: account.id });

      await this.fetchUsersPage(1);
    },

    async fetchUsersPage(page: number) {
      try {
        this.$wait.start(WaitKey.FETCH_USERS);
        const response = await usersApi.getUsers(page);
        this.usersList = response.data;
        this.usersListTotalPages = response.total_pages;
        this.usersListTotal = response.total;
        this.usersListPage = response.page;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.$wait.end(WaitKey.FETCH_USERS);
      }
    },

    async setUsersPage(page: number) {
      if (page > 0 && page <= this.usersListTotalPages) {
        await this.fetchUsersPage(page);
      }
    },
  },
});
