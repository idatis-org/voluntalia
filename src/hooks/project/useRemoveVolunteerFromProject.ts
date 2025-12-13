import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error?.response?.data?.message ||
          error.message ||
          'No se pudo remover el voluntario',
      });
    },
  });
};
