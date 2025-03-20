import apiClient from "@/services/api/http";

export interface UserDTO {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

const getUsers = async (): Promise<UserDTO[]> => {
  const resp = await apiClient.get("users?delay=1");
  const result = resp.data;
  const users = result.data;
  // Randomize the order of users
  return users.sort(() => Math.random() - 0.5);
};

const getUser = async (id: string | number): Promise<UserDTO> => {
  const resp = await apiClient.get(`users/${id}?delay=1`);
  const result = resp.data;
  const user = result.data;
  return user;
};

export default {
  getUsers,
  getUser,
};
