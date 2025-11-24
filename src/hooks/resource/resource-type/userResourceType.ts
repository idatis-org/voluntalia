import { useQuery } from '@tanstack/react-query';
import { getResourceTypes } from '@/services/resourceService';
import { ResourceType } from '@/types/resource';

export const useResourceType = () => {
  return useQuery<ResourceType[], Error>({
    queryKey: ['resource-types'],
    queryFn: getResourceTypes,
  });
};
