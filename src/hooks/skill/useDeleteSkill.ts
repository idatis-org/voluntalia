import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkill } from "@/services/skillService";

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};
