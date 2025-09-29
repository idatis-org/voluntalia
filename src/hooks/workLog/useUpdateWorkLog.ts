import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorklog } from "@/services/workLogService";
import { UpdateWorkLogDTO, WorkLog } from "@/types/workLog";

export const useUpdateWorklog = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { id: string; data: Partial<UpdateWorkLogDTO> }>({
    mutationFn: ({ id, data }) => updateWorklog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worklog"] });
    },
  });
};