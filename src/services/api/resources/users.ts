import apiClient from "@/services/api/http";
import { PaginatedUsers } from "@/types/api";

const usersApi = {
  getUsers: async (page = 1): Promise<PaginatedUsers> => {
    const response = await apiClient.get(`/users?page=${page}&delay=1`);
    return response.data;
  },
};

export default usersApi;
