import api from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectResponse,
  ProjectsResponse,
} from '@/types/project';
import { camelizeKeys, snakeifyKeys } from '@/lib/caseUtils';

/**
 * GET - Listar todos los proyectos
 */
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<ProjectsResponse>(ENDPOINTS.PROJECTS);
  const raw = response.data?.projects ?? [];
  return camelizeKeys<Project[]>(raw);
};

/**
 * GET - Obtener proyecto por ID con relaciones completas
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const response = await api.get<ProjectResponse>(
    `${ENDPOINTS.PROJECTS}/${id}`
  );
  const raw = response.data?.project ?? response.data;
  return camelizeKeys<Project>(raw);
};

/**
 * POST - Crear nuevo proyecto
 */
export const createProject = async (
  data: CreateProjectDTO
): Promise<Project> => {
  // Limpiar campos vacíos - no enviar strings vacíos para fechas
  const cleanData = {
    name: data.name,
    manager_id: data.manager_id,
    description: data.description || undefined,
    start_date: data.start_date || undefined,
    end_date: data.end_date || undefined,
  };
  
  const payload = snakeifyKeys(cleanData);
  const response = await api.post<ProjectResponse>(
    `${ENDPOINTS.PROJECTS}/create`,
    payload
  );
  const raw = response.data?.project ?? response.data;
  return camelizeKeys<Project>(raw);
};

/**
 * PUT - Actualizar proyecto existente
 */
export const updateProject = async (
  id: string,
  data: UpdateProjectDTO
): Promise<Project> => {
  // Limpiar campos vacíos
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
  );
  
  const payload = snakeifyKeys(cleanData);
  const response = await api.put<ProjectResponse>(
    `${ENDPOINTS.PROJECTS}/${id}`,
    payload
  );
  const raw = response.data?.project ?? response.data;
  return camelizeKeys<Project>(raw);
};

/**
 * DELETE - Eliminar proyecto
 */
export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`${ENDPOINTS.PROJECTS}/${id}`);
};

/**
 * POST - Agregar voluntario al proyecto
 */
export const addVolunteerToProject = async (
  projectId: string,
  userId: string
): Promise<void> => {
  await api.post(`${ENDPOINTS.PROJECTS}/${projectId}/volunteers`, {
    user_id: userId,
  });
};

/**
 * DELETE - Remover voluntario del proyecto
 */
export const removeVolunteerFromProject = async (
  projectId: string,
  userId: string
): Promise<void> => {
  await api.delete(`${ENDPOINTS.PROJECTS}/${projectId}/volunteers/${userId}`);
};

/**
 * PUT - Asignar actividad a proyecto
 */
export const assignActivityToProject = async (
  activityId: string,
  projectId: string
): Promise<void> => {
  await api.put(`/activities/${activityId}/project`, {
    project_id: projectId,
  });
};
