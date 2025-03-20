import { defineStore } from "pinia";
import usersApi, { UserDTO } from "@/services/api/resources/users";
import { WaitKey } from "@/constants";

interface Account {
  id: string;
  name: string;
}

export const useAccountStore = defineStore("account", {
  state: () => ({
    accountId: "",
    name: "",
    users: [] as UserDTO[],
  }),

  getters: {
    currentAccount: (state): Account => ({
      id: state.accountId,
      name: state.name,
    }),
    accountUsers: (state): UserDTO[] => state.users,
  },

  actions: {
    async setAccount(account: Account) {
      this.accountId = account.id;
      this.name = account.name;

      try {
        this.$wait.start(WaitKey.FETCH_USERS);
        this.users = await usersApi.getUsers();
      } catch (error) {
        console.error("Failed to fetch users:", error);
        this.users = [];
      } finally {
        this.$wait.end(WaitKey.FETCH_USERS);
      }
    },
  },
});
