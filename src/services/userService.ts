import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { User, UserResponse } from "@/types/user";
import { ApiResponse } from "@/types/api";

type CreateUserResponse = {
  user: User;
  country: string;
  city: string;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<UserResponse>(ENDPOINTS.USERS);
  console.log(response);
  return response.data.users;
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get<{ user: User }>(ENDPOINTS.ME);
  console.log(response);
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`${ENDPOINTS.USERS}/${id}`);
  return response.data.data;
};

export const createUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<User> => {
  const response = await api.post<CreateUserResponse>(ENDPOINTS.REGISTER, user);
  console.log(response);
  return response.data.user;
};

export const updateUser = async (
  id: number,
  userData: Partial<User>
): Promise<User> => {
  const response = await api.put<User>(`${ENDPOINTS.USERS}/${id}`, userData);
  return response.data;
};
