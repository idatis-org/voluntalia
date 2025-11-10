import api from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { Auth } from '@/types/auth';
import { ApiResponse } from '@/types/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const loginUser = async ({
  email,
  password,
}: LoginPayload): Promise<Auth> => {
  const response = await api.post<Auth>(ENDPOINTS.LOGIN, { email, password });
  return response.data;
};

export const resetPassword = async ({
  token,
  newPassword,
}: ResetPasswordPayload): Promise<ApiResponse<void>> => {
  const response = await api.post<ApiResponse<void>>(ENDPOINTS.RESET_PASSWORD, {
    token: token.trim(),
    newPassword,
  });
  return response.data;
};
