import { useQuery } from '@tanstack/react-query';
import { getFiles } from '@/services/resourceService';
import { Resource } from '@/types/resource';

export const useResource = () => {
  return useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: getFiles,
  });
};
