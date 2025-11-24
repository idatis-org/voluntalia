import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteResource } from '@/services/resourceService';

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};
