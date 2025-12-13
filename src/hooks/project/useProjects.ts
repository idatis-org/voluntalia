import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/projectService';
import type { Project } from '@/types/project';

/**
 * Hook para obtener la lista de todos los proyectos
 * Cachea por 5 minutos
 */
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 min
  });
};
