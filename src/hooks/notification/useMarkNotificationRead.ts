import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "@/services/notificationService";

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
