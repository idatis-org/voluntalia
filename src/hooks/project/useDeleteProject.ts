import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { deleteProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para eliminar un proyecto
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, deletedProjectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['projects', deletedProjectId] });

      toast({
        title: 'Proyecto eliminado',
        description: 'El proyecto ha sido eliminado permanentemente',
      });
    },
    onError: (error: Error) => {
      let description = 'No se pudo eliminar el proyecto';
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
