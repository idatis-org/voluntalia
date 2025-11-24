import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteActivity } from '@/services/activityService';

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};
