import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/project/useProjects';
import { isCoordinator } from '@/config/permissions';
import { useNavigate } from 'react-router-dom';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { PageLayout } from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FolderOpen } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { useState, useMemo } from 'react';

/**
 * Página principal de Proyectos
 * Listado simplificado de proyectos con navegación a detalles
 */
export const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isCoord = isCoordinator(user?.role);

  // Filtrar proyectos por búsqueda
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const term = searchTerm.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  // Estado de carga
  if (isLoading) {
    return (
      <PageLayout title="Proyectos" description="Cargando...">
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center space-y-4">
            <Spinner />
            <p className="text-muted-foreground">Cargando proyectos...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Proyectos" description="Gestión de proyectos y voluntarios">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Proyectos</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredProjects.length} proyecto
                  {filteredProjects.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {isCoord && (
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          )}
        </div>

        {/* Búsqueda */}
        <div>
          <Input
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Contenido */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-muted-foreground/30 rounded-lg">
            <FolderOpen className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {searchTerm
                ? 'No se encontraron proyectos'
                : 'No hay proyectos aún'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm
                ? 'Intenta con otra búsqueda'
                : isCoord
                  ? 'Crea tu primer proyecto para comenzar'
                  : 'Los coordinadores pueden crear proyectos aquí'}
            </p>
            {!searchTerm && isCoord && (
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Proyecto
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Modal crear proyecto */}
      <ProjectForm
        open={showCreateModal}
        project={null}
        onOpenChange={setShowCreateModal}
      />
    </PageLayout>
  );
};

export default Projects;
