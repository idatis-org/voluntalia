import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { Auth } from "@/types/auth";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginPayload): Promise<Auth> => {
  const response = await api.post<Auth>(ENDPOINTS.LOGIN, {email, password});
  console.log(response);
  return response.data;
};
