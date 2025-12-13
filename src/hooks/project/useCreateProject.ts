import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import type { CreateProjectDTO, Project } from '@/types/project';

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
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error?.response?.data?.message ||
          error.message ||
          'No se pudo crear el proyecto',
      });
    },
  });
};
