import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActivity } from "@/services/activityService";
import { ActivityTask } from "@/types/activity";

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation<ActivityTask, Error, Omit<ActivityTask, "id">>({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};