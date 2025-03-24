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
  favoriteUsers: User[];
  favoriteUsersFetched: boolean;
}

export const useAccountStore = defineStore("account", {
  state: (): AccountState => ({
    currentAccount: null,
    usersList: [],
    usersListPage: 1,
    usersListTotalPages: 1,
    usersListTotal: 0,
    favoriteUsers: [],
    favoriteUsersFetched: false,
  }),

  actions: {
    async setAccount(account: Account): Promise<boolean> {
      try {
        this.currentAccount = account;
        this.usersList = [];
        this.usersListPage = 1;

        // Update URL with account ID
        queryParser.setQueryParams({ accountId: account.id });

        // Load users and optionally favorite users simultaneously
        await Promise.all([
          this.fetchUsersPage(1),
          // If favorite users were previously fetched, fetch them for the new account too
          ...(this.favoriteUsersFetched ? [this.fetchFavoriteUsers()] : []),
        ]);

        return true;
      } catch (error) {
        console.error("Error setting account:", error);
        return false;
      }
    },

    async fetchUsersPage(page: number): Promise<boolean> {
      try {
        this.$wait.start(WaitKey.FETCH_USERS);
        const response = await usersApi.getUsers({
          accountId: this.currentAccount?.id || "",
          page,
        });
        this.usersList = response.data;
        this.usersListTotalPages = response.total_pages;
        this.usersListTotal = response.total;
        this.usersListPage = response.page;
        return true;
      } catch (error) {
        console.error("Error fetching users:", error);
        return false;
      } finally {
        this.$wait.end(WaitKey.FETCH_USERS);
      }
    },

    async setUsersPage(page: number): Promise<boolean> {
      if (page > 0 && page <= this.usersListTotalPages) {
        return await this.fetchUsersPage(page);
      }
      return false;
    },

    async fetchFavoriteUsers(): Promise<boolean> {
      if (!this.currentAccount) return false;

      try {
        this.$wait.start(WaitKey.FETCH_FAVORITE_USERS);
        const favorites = await usersApi.getFavoriteUsers(
          this.currentAccount.id
        );
        this.favoriteUsers = favorites;
        this.favoriteUsersFetched = true;
        return true;
      } catch (error) {
        console.error("Error fetching favorite users:", error);
        return false;
      } finally {
        this.$wait.end(WaitKey.FETCH_FAVORITE_USERS);
      }
    },

    clearFavoriteUsers(): void {
      this.favoriteUsers = [];
      this.favoriteUsersFetched = false;
    },
  },
});
