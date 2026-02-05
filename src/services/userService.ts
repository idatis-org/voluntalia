import api from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse } from '@/types/api';
import { camelizeKeys, snakeifyKeys } from '@/lib/caseUtils';
import { User } from '@/types/user';

type CreateUserResponse = {
  user: User;
  country: string;
  city: string;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get(ENDPOINTS.USERS);
  // Normalize keys from snake_case to camelCase
  const raw = response.data?.users ?? [];
  const users = camelizeKeys<User[]>(raw).map((u) => ({
    ...u,
    // ensure createdAt exists (fallback from snake_case)
    createdAt:
      u.createdAt ??
      ((u as unknown as Record<string, unknown>)['created_at'] as
        | string
        | undefined),
  }));
  return users;
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get(ENDPOINTS.ME);
  const raw = response.data?.user ?? response.data;
  const user = camelizeKeys<User>(raw);
  user.createdAt =
    user.createdAt ??
    ((raw as Record<string, unknown>)['created_at'] as string | undefined);
  return { user };
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(`${ENDPOINTS.USERS}/${id}`);
  return response.data.data;
};

export const createUser = async (
  user: Omit<User, 'id' | 'created_at'>
): Promise<User> => {
  // Convert outgoing keys to snake_case if backend expects it
  const payload = snakeifyKeys(user);
  const response = await api.post<CreateUserResponse>(
    ENDPOINTS.REGISTER,
    payload
  );
  const raw = response.data?.user ?? response.data;
  const created = camelizeKeys<User>(raw);
  created.createdAt =
    created.createdAt ??
    ((raw as Record<string, unknown>)['created_at'] as string | undefined);
  return created;
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const payload = snakeifyKeys(userData);
  const response = await api.put(`${ENDPOINTS.USERS}/${id}`, payload);
  const raw = response.data;
  const updated = camelizeKeys<User>(raw);
  updated.createdAt =
    updated.createdAt ??
    ((raw as Record<string, unknown>)['created_at'] as string | undefined);
  return updated;
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  const response = await api.patch(`${ENDPOINTS.USERS}/${id}/toggle-status`);
  const raw = response.data?.user ?? response.data;
  const toggled = camelizeKeys<User>(raw);
  toggled.createdAt =
    toggled.createdAt ??
    ((raw as Record<string, unknown>)['created_at'] as string | undefined);
  return toggled;
};
