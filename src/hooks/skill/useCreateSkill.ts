import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSkill } from "@/services/skillService";
import { CreateSkillDTO } from "@/types/skill";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (skill: CreateSkillDTO) => createSkill(skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};
