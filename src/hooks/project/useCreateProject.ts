import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { createProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/project';

/**
 * Hook para crear un nuevo proyecto
 * Invalida queries para refetch automático
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject: Project) => {
      // Invalidar queries para refetch automático
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      toast({
        title: 'Proyecto creado',
        description: `"${newProject.name}" ha sido creado exitosamente`,
      });
    },
    onError: (error: Error) => {
      let description = 'No se pudo crear el proyecto';
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
