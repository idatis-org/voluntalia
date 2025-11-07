import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { Auth } from "@/types/auth";
import { camelizeKeys } from "@/lib/caseUtils";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginPayload): Promise<Auth> => {
  const response = await api.post(ENDPOINTS.LOGIN, { email, password });
  const raw = response.data as any;
  // normalize user if present (snake_case -> camelCase)
  const rawUser = raw.user ?? raw;
  const normalizedUser = camelizeKeys<any>(rawUser);
  normalizedUser.createdAt = normalizedUser.createdAt ?? (rawUser as any).created_at;
  return { ...raw, user: normalizedUser } as Auth;
};
