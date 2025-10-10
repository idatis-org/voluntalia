import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSkill } from "@/services/skillService";
import { CreateSkillDTO } from "@/types/skill";

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, skill }: { id: string; skill: CreateSkillDTO }) =>
      updateSkill(id, skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};
