import { useQuery } from '@tanstack/react-query';
import { getVolunteersByActivity } from '@/services/activityService';
import { VolunteersByActivity } from '@/types/activity';

export const useGetVolunteersByActivity = (activityId: string) => {
  return useQuery<VolunteersByActivity[], Error>({
    queryKey: ['activities', activityId],
    queryFn: () => getVolunteersByActivity(activityId),
  });
};
