import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleUserStatus } from '@/services/userService';
import { User } from '@/types/user';

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, string>({
    mutationFn: (id: string) => toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
