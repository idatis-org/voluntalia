import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/services/skillService";
import { Skill } from "@/types/skill";

export const useSkills = () => {
  return useQuery<Skill[], Error>({
    queryKey: ["skills"],
    queryFn: getSkills,
  });
};
