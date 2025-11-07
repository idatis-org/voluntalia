import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { camelizeKeys, snakeifyKeys } from "@/lib/caseUtils";

type CreateUserResponse = {
  user: User;
  country: string;
  city: string;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get(ENDPOINTS.USERS);
  // Normalize keys from snake_case to camelCase
  const raw = response.data?.users ?? [];
  const users = camelizeKeys<any[]>(raw).map((u) => ({
    ...u,
    // ensure createdAt exists
    createdAt: u.createdAt ?? (u as any).created_at,
  }));
  return users as User[];
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get(ENDPOINTS.ME);
  const raw = response.data?.user ?? response.data;
  const user = camelizeKeys<any>(raw);
  user.createdAt = user.createdAt ?? (raw as any).created_at;
  return { user } as { user: User };
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`${ENDPOINTS.USERS}/${id}`);
  return response.data.data;
};

export const createUser = async (
  user: Omit<User, "id" | "createdAt">
): Promise<User> => {
  // Convert outgoing keys to snake_case if backend expects it
  const payload = snakeifyKeys(user);
  const response = await api.post<CreateUserResponse>(ENDPOINTS.REGISTER, payload);
  const raw = response.data?.user ?? response.data;
  const created = camelizeKeys<any>(raw);
  created.createdAt = created.createdAt ?? (raw as any).created_at;
  return created as User;
};

export const updateUser = async (
  id: number,
  userData: Partial<User>
): Promise<User> => {
  const payload = snakeifyKeys(userData);
  const response = await api.put(`${ENDPOINTS.USERS}/${id}`, payload);
  const raw = response.data;
  const updated = camelizeKeys<any>(raw);
  updated.createdAt = updated.createdAt ?? (raw as any).created_at;
  return updated as User;
};
