import apiClient from "@/services/api/http";
import { PaginatedUsers } from "@/types/api";

// Account 3 ID hardcoded for this demo
const ACCOUNT3_ID = "d9a95ed9-b62a-4a0c-857d-abadc94bb7b2";

const usersApi = {
  getUsers: async ({
    accountId,
    page = 1,
  }: {
    accountId: string;
    page: number;
  }): Promise<PaginatedUsers> => {
    const response = await apiClient.get(`/users?page=${page}&delay=1`);
    return response.data;
  },
};

export default usersApi;
