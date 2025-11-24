// hooks/useCreateUser.ts
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { CreateWorkLogDTO, WorkLog } from '@/types/workLog';
import { createWorkLog } from '@/services/workLogService';

export const useCreateWorkLog = (): UseMutationResult<
  WorkLog,
  Error,
  CreateWorkLogDTO
> => {
  const queryClient = useQueryClient();

  return useMutation<WorkLog, Error, CreateWorkLogDTO>({
    mutationFn: createWorkLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklog'] });
    },
  });
};
