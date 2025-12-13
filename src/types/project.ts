import { User } from './user';
import { ActivityTask } from './activity';

/**
 * Project - Entidad principal de proyectos
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  manager_id: string;
  created_by: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
  manager?: User;
  creator?: User;
  volunteers?: User[];
  activities?: ActivityTask[];
}

/**
 * Project con relaciones completas (usado cuando traes detalle)
 */
export interface ProjectWithRelations extends Project {
  manager: User;
  creator: User;
  volunteers: User[];
  activities: ActivityTask[];
}

/**
 * DTO para crear proyecto
 */
export interface CreateProjectDTO {
  name: string; // Requerido
  manager_id: string; // Requerido - User ID del manager
  description?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
}

/**
 * DTO para actualizar proyecto
 */
export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Filtros para listar proyectos
 */
export interface ProjectFilters {
  search?: string;
  manager_id?: string;
  sortBy?: 'name' | 'createdAt' | 'start_date';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Response types
 */
export interface ProjectResponse {
  project: Project;
}

export interface ProjectsResponse {
  projects: Project[];
}
