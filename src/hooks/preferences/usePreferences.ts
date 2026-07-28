import { useQuery } from "@tanstack/react-query";
import { getPreferences } from "@/services/preferencesService";
import { UserPreferences } from "@/types/preferences";

export const usePreferences = () => {
  return useQuery<UserPreferences, Error>({
    queryKey: ["preferences"],
    queryFn: getPreferences,
    staleTime: 1000 * 60,
  });
};
