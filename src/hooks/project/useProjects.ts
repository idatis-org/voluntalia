import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/projectService';
import type { ProjectsResponse } from '@/types/project';

/**
 * Hook para obtener la lista de todos los proyectos
 * Cachea por 5 minutos
 */
export const useProjects = (params?: Record<string, unknown>) => {
  return useQuery<ProjectsResponse, Error>({
    queryKey: ['projects', params ?? {}],
    queryFn: () => getProjects(params),
    staleTime: 5 * 60 * 1000, // 5 min
  });
};
