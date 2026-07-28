import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendNotification } from "@/services/notificationService";
import { SendNotificationDTO } from "@/types/notification";

export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SendNotificationDTO>({
    mutationFn: sendNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
