import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserSkills,
  assignSkillToUser,
  removeSkillFromUser,
} from '@/services/skillService';
import { Skill } from '@/types/skill';

export const useUserSkills = (userId: string) => {
  return useQuery<Skill[], Error>({
    queryKey: ['userSkills', userId],
    queryFn: () => getUserSkills(userId),
    enabled: !!userId,
  });
};

export const useAssignSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, skillId }: { userId: string; skillId: string }) =>
      assignSkillToUser(userId, skillId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['userSkills', variables.userId],
      });
    },
  });
};

export const useRemoveSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, skillId }: { userId: string; skillId: string }) =>
      removeSkillFromUser(userId, skillId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['userSkills', variables.userId],
      });
    },
  });
};
