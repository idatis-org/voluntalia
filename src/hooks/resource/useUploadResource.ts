// hooks/useUploadResource.ts
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { CreateResourceWithFileDTO, Resource } from '@/types/resource';
import { uploadResourceWithFile } from '@/services/resourceService';

export const useUploadResource = (): UseMutationResult<
  Resource,
  Error,
  CreateResourceWithFileDTO
> => {
  const queryClient = useQueryClient();

  return useMutation<Resource, Error, CreateResourceWithFileDTO>({
    mutationFn: uploadResourceWithFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};
