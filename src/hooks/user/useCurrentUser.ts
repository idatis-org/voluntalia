import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/services/userService';
import { User } from '@/types/user';

export const useCurrentUser = () => {
  return useQuery<{ user: User }, Error>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false, // opcional: si no hay usuario autenticado, evita reintentar
    refetchOnWindowFocus: false,
  });
};
