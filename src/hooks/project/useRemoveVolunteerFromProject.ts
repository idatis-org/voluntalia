import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { removeVolunteerFromProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para remover un voluntario de un proyecto
 */
export const useRemoveVolunteerFromProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => removeVolunteerFromProject(projectId, userId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });

      toast({
        title: 'Voluntario removido',
        description: 'El voluntario ha sido desasignado del proyecto',
      });
    },
    onError: (error: Error) => {
      let description = 'No se pudo remover el voluntario';
      if (isAxiosError(error)) {
        description = error.response?.data?.message || error.message || description;
      } else {
        description = error.message || description;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description,
      });
    },
  });
};
