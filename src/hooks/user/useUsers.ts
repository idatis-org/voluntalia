import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/userService';
import { User } from '@/types/user';

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60, // 1 min de cache
  });
};
