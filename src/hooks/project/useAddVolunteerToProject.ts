import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addVolunteerToProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para agregar un voluntario a un proyecto
 */
export const useAddVolunteerToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => addVolunteerToProject(projectId, userId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });

      toast({
        title: 'Voluntario agregado',
        description: 'El voluntario ha sido asignado al proyecto exitosamente',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error?.response?.data?.message ||
          error.message ||
          'No se pudo agregar el voluntario',
      });
    },
  });
};
