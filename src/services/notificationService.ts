import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { AppNotification, SendNotificationDTO } from "@/types/notification";
import { camelizeKeys, snakeifyKeys } from "@/lib/caseUtils";

export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await api.get(ENDPOINTS.NOTIFICATIONS);
  const raw = response.data?.data ?? [];
  return camelizeKeys<AppNotification[]>(raw);
};

export const sendNotification = async (data: SendNotificationDTO): Promise<void> => {
  await api.post(`${ENDPOINTS.NOTIFICATIONS}/send`, snakeifyKeys(data));
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.patch(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`);
};
