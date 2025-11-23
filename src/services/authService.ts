import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { Auth } from "@/types/auth";
import { ApiResponse } from "@/types/api";
import { camelizeKeys } from "@/lib/caseUtils";

interface LoginPayload {
  email: string;
  password: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const loginUser = async ({ email, password }: LoginPayload): Promise<Auth> => {
  const response = await api.post(ENDPOINTS.LOGIN, { email, password });
  const data = response.data as Record<string, unknown>;

  // raw user object may be under `user` or be the response itself
  const rawUser = (data['user'] ?? data) as unknown;
  const normalizedUser = camelizeKeys<import("@/types/user").User>(rawUser);

  const createdAtFromRaw =
    rawUser && typeof rawUser === 'object'
      ? (rawUser as Record<string, unknown>)['created_at'] as string | undefined
      : undefined;

  normalizedUser.createdAt = normalizedUser.createdAt ?? createdAtFromRaw;

  // Build Auth payload explicitly to avoid spreading unknowns
  const accessToken = (data['accessToken'] ?? data['access_token']) as string | undefined;
  const refreshToken = (data['refreshToken'] ?? data['refresh_token']) as string | undefined;

  return {
    accessToken: accessToken ?? "",
    refreshToken: refreshToken ?? "",
    user: normalizedUser,
  } as Auth;
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
