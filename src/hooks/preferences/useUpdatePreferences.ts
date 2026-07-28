import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePreferences } from "@/services/preferencesService";
import { UserPreferences, UpdateUserPreferencesDTO } from "@/types/preferences";

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation<UserPreferences, Error, UpdateUserPreferencesDTO>({
    mutationFn: updatePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(["preferences"], data);
    },
  });
};
