import { useQuery } from '@tanstack/react-query';
import { getWorkLogsByUser } from '@/services/workLogService';
import { WorkLog } from '@/types/workLog';

export const useWorkLog = () => {
  return useQuery<WorkLog[], Error>({
    queryKey: ['worklog'],
    queryFn: getWorkLogsByUser,
    staleTime: 1000 * 60, // 1 min de cache
  });
};
