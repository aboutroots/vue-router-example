import apiClient from "@/services/api/http";
import { PaginatedUsers, User } from "@/types/api";

const delay = (range: { min: number; max: number }) => {
  const ms =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const usersApi = {
  getUsers: async ({
    accountId,
    page = 1,
  }: {
    accountId: string;
    page: number;
  }): Promise<PaginatedUsers> => {
    await delay({ min: 700, max: 1300 });
    const response = await apiClient.get(`/users?page=${page}`);
    return response.data;
  },

  getFavoriteUsers: async (accountId: string): Promise<User[]> => {
    // Always get the 2nd page of users
    await delay({ min: 700, max: 1300 });
    const response = await apiClient.get(`/users?page=2`);

    // Get the last 3 users from the page
    const allUsers = response.data.data;
    const lastThreeUsers = allUsers.slice(Math.max(0, allUsers.length - 3));

    // Return them in random order
    return lastThreeUsers.sort(() => Math.random() - 0.5);
  },
};

export default usersApi;
