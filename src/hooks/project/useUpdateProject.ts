import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { updateProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import type { UpdateProjectDTO } from '@/types/project';

/**
 * Hook para actualizar un proyecto existente
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDTO }) =>
      updateProject(id, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', updatedProject.id] });

      toast({
        title: 'Proyecto actualizado',
        description: 'Los cambios han sido guardados exitosamente',
      });
    },
    onError: (error: Error) => {
      let description = 'No se pudo actualizar el proyecto';
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
