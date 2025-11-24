import { useQuery } from '@tanstack/react-query';
import { getActivities } from '@/services/activityService';
import { ActivityTask } from '@/types/activity';

export const useActivities = () => {
  return useQuery<ActivityTask[], Error>({
    queryKey: ['activities'],
    queryFn: getActivities,
  });
};
