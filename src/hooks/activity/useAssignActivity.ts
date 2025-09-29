import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignActivity, unassignActivity } from '@/services/activityService';

export const useAssignActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, userId }: { activityId: string; userId: string }) =>
      assignActivity(activityId, userId), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUnassignActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityId, userId }: { activityId: string; userId: string }) =>
      unassignActivity(activityId, userId), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};