import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notificationService";
import { AppNotification } from "@/types/notification";

export const useNotifications = () => {
  return useQuery<AppNotification[], Error>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1000 * 60, // 1 min de cache
  });
};
