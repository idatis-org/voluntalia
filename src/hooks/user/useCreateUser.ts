// hooks/useCreateUser.ts
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { createUser } from '@/services/userService';
import { CreateUserDTO, User } from '@/types/user';

export const useCreateUser = (): UseMutationResult<
  User,
  Error,
  CreateUserDTO
> => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserDTO>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
