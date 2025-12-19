import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PageLayout } from '@/components/common/PageLayout';
import { StatsGrid } from '@/components/common/StatsGrid';
import { ProjectsToolbar } from '@/components/projects/ProjectsToolbar';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectCardSkeletons } from '@/components/projects/ProjectCardSkeletons';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAuth } from '@/contexts/AuthContext';
import { isCoordinator } from '@/config/permissions';
import { useProjects } from '@/hooks/project/useProjects';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';
import { useToast } from '@/hooks/use-toast';
import { FolderOpen, Calendar, Play, CheckCircle } from 'lucide-react';
import { Project } from '@/types/project';

export const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCoord = isCoordinator(user?.role);

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ manager?: string[]; status?: string[]; dateFrom?: string; dateTo?: string }>({ 
    status: ['planned', 'active'], 
    manager: undefined // undefined means "All" (no filter applied)
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; projectId?: string }>({ isOpen: false });

  // Fetch projects
  const { data: projectsData, isLoading, refetch } = useProjects({
    per_page: 100, // Fetch more projects to allow client-side filtering/search
  });

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  // Normalize data
  const rawProjects = projectsData as any;
  const allProjects = useMemo(() => {
    // Handle different API response structures
    let projects = [];
    if (Array.isArray(rawProjects)) {
      projects = rawProjects;
    } else if (rawProjects?.projects && Array.isArray(rawProjects.projects)) {
      projects = rawProjects.projects;
    } else if (rawProjects?.data && Array.isArray(rawProjects.data)) {
      projects = rawProjects.data;
    }
    
    // Sort by createdAt descending to see new projects first
    return [...projects].sort((a: Project, b: Project) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [rawProjects]);

  const totalItems = rawProjects?.meta?.total ?? allProjects.length;
  const totalPages = rawProjects?.meta?.total_pages ?? Math.ceil(totalItems / itemsPerPage);
  // Derive managers list for filter select
  const managers: { id: string; name: string }[] = Array.from(
    new Map(
      allProjects
        .map((p: Project) => p.manager)
        .filter(Boolean)
        .map((m: any) => [m.id, { id: m.id, name: m.name }])
    ).values()
  ) as { id: string; name: string }[];

  // Search and filter - with custom logic for nested fields and date search
  const filteredProjects = useMemo(() => {
    // Apply filters first
    let candidates = [...allProjects];
    
    // Status filter
    if (filters?.status && filters.status.length > 0) {
      candidates = candidates.filter((p: Project) => {
        // If project has no status, show it if we are searching or if no specific status is required
        if (!p.status) return true;
        
        const pStatus = p.status.toLowerCase();
        const isDelayed = pStatus === 'planned' && p.startDate && new Date(p.startDate) < new Date();
        
        if (isDelayed && filters.status!.includes('delayed')) return true;
        if (pStatus === 'planned' && !isDelayed && filters.status!.includes('planned')) return true;
        
        return filters.status!.some(s => s.toLowerCase() === pStatus && s !== 'delayed' && s !== 'planned');
      });
    }

    // Manager filter
    if (filters?.manager) {
      candidates = candidates.filter((p: Project) => filters.manager!.includes(p.manager?.id || ''));
    }

    // Date range filters
    if (filters?.dateFrom) {
      const from = new Date(filters.dateFrom);
      candidates = candidates.filter((p: Project) => p.startDate ? new Date(p.startDate) >= from : false);
    }
    if (filters?.dateTo) {
      const to = new Date(filters.dateTo);
      candidates = candidates.filter((p: Project) => p.endDate ? new Date(p.endDate) <= to : false);
    }

    if (!searchTerm.trim()) return candidates;

    const term = searchTerm.toLowerCase();
    
    // Normalize: remove accents/tildes
    const normalize = (s: string | null | undefined) => 
      (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    
    const normalizedTerm = normalize(term);

    // Month names for date search
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const getDateSearchValue = (dateStr: string): string => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const day = String(date.getDate()).padStart(2, '0');
        return `${day} ${month} ${year}`;
      } catch {
        return dateStr;
      }
    };

    return candidates.filter((project: Project) => {
      // Search in name
      if (normalize(project.name).includes(normalizedTerm)) return true;
      // Search in description
      if (normalize(project.description).includes(normalizedTerm)) return true;
      // Search in manager name
      if (normalize(project.manager?.name).includes(normalizedTerm)) return true;
      // Search in creator name
      if (normalize(project.creator?.name).includes(normalizedTerm)) return true;
      
      // Search in dates (multiple formats)
      if (project.startDate) {
        const startDateFormatted = normalize(getDateSearchValue(project.startDate));
        const startDateRaw = normalize(project.startDate);
        if (startDateFormatted.includes(normalizedTerm) || startDateRaw.includes(normalizedTerm)) return true;
      }
      
      if (project.endDate) {
        const endDateFormatted = normalize(getDateSearchValue(project.endDate));
        const endDateRaw = normalize(project.endDate);
        if (endDateFormatted.includes(normalizedTerm) || endDateRaw.includes(normalizedTerm)) return true;
      }
      
      return false;
    });
  }, [allProjects, searchTerm, filters]);


  // Paginate filtered results
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProjects.slice(start, end);
  }, [filteredProjects, currentPage]);

  // Compute total pages from filtered results
  const filteredTotalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  // Compute active filters summary
  const activeFilters: string[] = [];
  if (searchTerm && searchTerm.trim().length > 0) {
    activeFilters.push(`Búsqueda: "${searchTerm.length > 20 ? searchTerm.slice(0, 20) + '…' : searchTerm}"`);
  }
  
  if (filters?.status && filters.status.length > 0) {
    const s = filters.status;
    const isDefaultStatus = s.length === 2 && s.includes('planned') && s.includes('active');
    
    if (!isDefaultStatus) {
      if (s.length === 5) {
        activeFilters.push('Estado: Todos');
      } else {
        const mapName: Record<string,string> = { 
          planned: 'Planificado', 
          delayed: 'Demorado',
          active: 'En progreso', 
          completed: 'Completado', 
          cancelled: 'Cancelado' 
        };
        const names = s.map(st => mapName[st] || st).join(', ');
        activeFilters.push(`Estado: ${names}`);
      }
    }
  }

  if (filters?.manager && filters.manager.length > 0) {
    if (filters.manager.length === managers.length && managers.length > 0) {
      // All selected, don't show badge
    } else {
      const managerNames = filters.manager
        .map(id => managers.find(m => m.id === id)?.name)
        .filter(Boolean)
        .join(', ');
      if (managerNames) activeFilters.push(`Responsable: ${managerNames}`);
    }
  }

  if (filters?.dateFrom || filters?.dateTo) {
    if (filters.dateFrom && filters.dateTo) {
      activeFilters.push(`Fecha: ${filters.dateFrom} a ${filters.dateTo}`);
    } else if (filters.dateFrom) {
      activeFilters.push(`Desde: ${filters.dateFrom}`);
    } else {
      activeFilters.push(`Hasta: ${filters.dateTo}`);
    }
  }

  // Handlers
  const handleResetSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({ status: ['planned', 'active'], manager: undefined });
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName: keyof (typeof filters), value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowCreateModal(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setDeleteConfirm({ isOpen: true, projectId });
  };

  const confirmDelete = () => {
    if (!deleteConfirm.projectId) return;

    deleteProject(deleteConfirm.projectId, {
      onSuccess: () => {
        toast({
          title: 'Éxito',
          description: 'Proyecto eliminado correctamente',
        });
        setDeleteConfirm({ isOpen: false });
        refetch();
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error?.message || 'Error al eliminar el proyecto',
          variant: 'destructive',
        });
      },
    });
  };

  const handleProjectAction = (
    action: 'view' | 'edit' | 'manage' | 'delete',
    projectId: string
  ) => {
    const project = allProjects.find((p: Project) => p.id === projectId);
    if (!project) return;

    switch (action) {
      case 'view':
        navigate(`/projects/${projectId}`);
        break;
      case 'edit':
        handleEditProject(project);
        break;
      case 'manage':
        navigate(`/projects/${projectId}/volunteers`);
        break;
      case 'delete':
        handleDeleteProject(projectId);
        break;
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setEditingProject(null);
    handleResetFilters(); // Reset filters to see the new project
    refetch();
  };

  // Compute stats
  const stats = useMemo(() => {
    return [
      { key: 'total', label: 'Total Projects', value: totalItems.toString(), icon: FolderOpen },
      { key: 'month', label: 'This Month', value: Math.floor(totalItems * 0.3).toString(), icon: Calendar },
      { key: 'active', label: 'Active', value: Math.floor(totalItems * 0.7).toString(), icon: Play },
      { key: 'completed', label: 'Completed', value: Math.floor(totalItems * 0.2).toString(), icon: CheckCircle },
    ];
  }, [totalItems]);

  // Loading state
  if (isLoading) {
    return (
      <PageLayout title="Proyectos" description="Gestión de proyectos y voluntarios">
        <StatsGrid stats={stats} columns={4} className="mb-6" isLoading={true} />
        <div className="space-y-6">
        <ProjectsToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilters={activeFilters}
            onReset={handleResetFilters}
            onCreate={() => setShowCreateModal(true)}
            canCreate={isCoord}
            filters={filters}
            onFilterChange={handleFilterChange}
            managers={managers}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            className="mb-6"
          />
          <ProjectCardSkeletons count={itemsPerPage} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Proyectos" description="Gestión de proyectos y voluntarios">
      <StatsGrid stats={stats} columns={4} className="mb-6" isLoading={isLoading} />

      <div className="space-y-6">
        {/* Toolbar */}
        <ProjectsToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          activeFilters={activeFilters}
          onReset={handleResetFilters}
          onCreate={() => {
            setEditingProject(null);
            setShowCreateModal(true);
          }}
          canCreate={isCoord}
          filters={filters}
          onFilterChange={handleFilterChange}
          managers={managers}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
          className="mb-6"
        />

        {/* Results count */}
        {filteredProjects.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {Math.min(filteredProjects.length, itemsPerPage)} of {totalItems} projects
            </span>
          </div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 ? (
          <Card className="shadow-soft border-accent/20 p-6">
            <CardHeader>
              <CardTitle>
                {allProjects.length === 0 
                  ? 'No hay proyectos aún' 
                  : 'No se encontraron resultados'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {allProjects.length === 0
                    ? (isCoord ? 'Crea tu primer proyecto para comenzar' : 'Los coordinadores pueden crear proyectos aquí')
                    : 'Intenta ajustar los filtros o la búsqueda para encontrar lo que buscas.'}
                </p>
                <div className="flex gap-2">
                  {allProjects.length === 0 && isCoord && (
                    <Button
                      onClick={() => {
                        setEditingProject(null);
                        setShowCreateModal(true);
                      }}
                      className="bg-gradient-primary"
                    >
                      Crear Primer Proyecto
                    </Button>
                  )}
                  {allProjects.length > 0 && (
                    <Button variant="outline" onClick={handleResetFilters}>
                      Limpiar filtros y búsqueda
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProjects.map((project: Project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showActions={isCoord || project.canEdit || project.canManageVolunteers}
                  onAction={handleProjectAction}
                />
              ))}
            </div>

            {/* Pagination */}
            {filteredTotalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {Array.from({ length: filteredTotalPages }, (_, i) => i + 1).map((page) => {
                      // Show first, last, and pages around current
                      const isFirst = page === 1;
                      const isLast = page === filteredTotalPages;
                      const isNearCurrent = Math.abs(page - currentPage) <= 1;

                      if (!isFirst && !isLast && !isNearCurrent) {
                        // Show ellipsis if needed
                        if (page === 2 || page === filteredTotalPages - 1) {
                          return <span key={`ellipsis-${page}`} className="px-2">...</span>;
                        }
                        return null;
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < filteredTotalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === filteredTotalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <ProjectForm
        open={showCreateModal}
        project={editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateModal(false);
            setEditingProject(null);
          }
        }}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Eliminar Proyecto"
        description="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </PageLayout>
  );
};

export default Projects;
