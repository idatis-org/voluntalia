import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { UserPreferences, UpdateUserPreferencesDTO } from "@/types/preferences";
import { camelizeKeys, snakeifyKeys } from "@/lib/caseUtils";

export const getPreferences = async (): Promise<UserPreferences> => {
  const response = await api.get(ENDPOINTS.USER_PREFERENCES);
  return camelizeKeys<UserPreferences>(response.data?.preferences);
};

export const updatePreferences = async (
  data: UpdateUserPreferencesDTO
): Promise<UserPreferences> => {
  const response = await api.put(ENDPOINTS.USER_PREFERENCES, snakeifyKeys(data));
  return camelizeKeys<UserPreferences>(response.data?.preferences);
};
