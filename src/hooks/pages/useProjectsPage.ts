import { useState, useMemo } from 'react';
import type { Project } from '@/types/project';
import { useProjects } from '@/hooks/project/useProjects';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';
import { useAddVolunteerToProject } from '@/hooks/project/useAddVolunteerToProject';
import { useRemoveVolunteerFromProject } from '@/hooks/project/useRemoveVolunteerFromProject';
import { useModal } from '@/hooks/common/useModal';

/**
 * Hook de orquestación para la página de Proyectos
 * Maneja: queries, mutations, modales, búsqueda, filtrado
 */
export const useProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Queries
  const { data, isLoading, error } = useProjects();
  const raw = data as any;
  const projects = Array.isArray(raw) ? raw : (raw?.projects ?? []);

  // Mutations
  const { mutate: deleteProjectMutation, isPending: isDeleting } =
    useDeleteProject();
  const { mutate: addVolunteerMutation } = useAddVolunteerToProject();
  const { mutate: removeVolunteerMutation } = useRemoveVolunteerFromProject();

  // Modales
  const projectFormModal = useModal<Project | null>();
  const confirmDeleteModal = useModal<Project>();
  const addVolunteerModal = useModal<Project>();

  // Search & Filter
  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      `${project.name} ${project.description || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // Handlers
  const handleCreateProject = () => {
    projectFormModal.openModal(null); // null = modo crear
  };

  const handleEditProject = (project: Project) => {
    projectFormModal.openModal(project);
  };

  const handleDeleteProject = (project: Project) => {
    confirmDeleteModal.openModal(project);
  };

  const handleConfirmDelete = () => {
    const projectId = confirmDeleteModal.data?.id;
    if (projectId) {
      deleteProjectMutation(projectId, {
        onSuccess: () => confirmDeleteModal.closeModal(),
      });
    }
  };

  const handleAddVolunteer = (project: Project) => {
    addVolunteerModal.openModal(project);
  };

  const handleRemoveVolunteer = (
    projectId: string,
    userId: string,
    onSuccess?: () => void
  ) => {
    removeVolunteerMutation(
      { projectId, userId },
      {
        onSuccess,
      }
    );
  };

  const handleVolunteerAdded = (userId: string) => {
    const project = addVolunteerModal.data;
    if (project) {
      addVolunteerMutation(
        { projectId: project.id, userId },
        {
          onSuccess: () => {
            // Opcional: limpiar la selección
          },
        }
      );
    }
  };

  return {
    // Data
    projects,
    isLoading,
    error: error as Error | null,

    // Search & Filter
    searchTerm,
    setSearchTerm,
    filteredProjects,

    // Modales
    projectFormModal,
    confirmDeleteModal,
    addVolunteerModal,

    // Mutations
    isDeleting,

    // Handlers - Proyecto
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    handleConfirmDelete,

    // Handlers - Voluntarios
    handleAddVolunteer,
    handleRemoveVolunteer,
    handleVolunteerAdded,
  };
};
