import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateActivity } from '@/services/activityService';
import { ActivityTask } from '@/types/activity';

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ActivityTask,
    Error,
    { id: string; data: Partial<Omit<ActivityTask, 'id'>> }
  >({
    mutationFn: ({ id, data }) => updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
};
