import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/userService";
import { User } from "@/types/user";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, { id: number; data: Partial<User> }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};