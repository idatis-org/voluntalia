import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { assignActivityToProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para asignar una actividad a un proyecto
 */
export const useAssignActivityToProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      activityId,
      projectId,
    }: {
      activityId: string;
      projectId: string;
    }) => assignActivityToProject(activityId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      toast({
        title: 'Actividad asignada',
        description: 'La actividad ha sido vinculada al proyecto exitosamente',
      });
    },
    onError: (error: Error) => {
      let description = 'No se pudo asignar la actividad';
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
