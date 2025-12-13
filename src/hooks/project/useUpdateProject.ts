import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error?.response?.data?.message ||
          error.message ||
          'No se pudo actualizar el proyecto',
      });
    },
  });
};
