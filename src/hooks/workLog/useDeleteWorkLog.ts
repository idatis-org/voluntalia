import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteWorklog } from '@/services/workLogService';

export const useDeleteWorklog = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteWorklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklog'] });
    },
  });
};
