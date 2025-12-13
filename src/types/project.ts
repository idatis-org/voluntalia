import { User } from './user';
import { ActivityTask } from './activity';

/**
 * Project - Entidad principal de proyectos
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  createdBy: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
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
  managerId: string; // Requerido - User ID del manager
  description?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

/**
 * DTO para actualizar proyecto
 */
export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Filtros para listar proyectos
 */
export interface ProjectFilters {
  search?: string;
  managerId?: string;
  sortBy?: 'name' | 'createdAt' | 'startDate';
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
