import { useQuery } from '@tanstack/react-query';
import { getProjectById } from '@/services/projectService';
import type { Project } from '@/types/project';

/**
 * Hook para obtener un proyecto por ID con sus relaciones
 * Se ejecuta solo si projectId está disponible
 */
export const useProjectById = (projectId: string | undefined) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId,
  });
};
