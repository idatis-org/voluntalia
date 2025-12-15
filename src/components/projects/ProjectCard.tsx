import { Project } from '@/types/project';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/formatDate';

interface ProjectCardProps {
  project: Project;
}

/**
 * Card simplificado para mostrar un proyecto
 * Información mínima indispensable: nombre, fechas, manager
 * Card completo clickeable navega a detalles del proyecto
 */
export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const volunteerCount = project.volunteers?.length || 0;
  const activityCount = project.activities?.length || 0;

  // Calcular estado general del proyecto basado en actividades
  const getProjectStatus = () => {
    if (!project.activities || project.activities.length === 0) {
      return 'Sin actividades';
    }
    // Aquí podríamos calcular basado en actividades cuando tengamos más datos
    return 'En progreso';
  };

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {getProjectStatus()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3 text-sm">
          {/* Fecha de Inicio */}
          {project.startDate && (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs text-muted-foreground">
                Inicio:
              </span>
              <span>{formatDate(new Date(project.startDate))}</span>
            </div>
          )}

          {/* Fecha de Fin */}
          {project.endDate && (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs text-muted-foreground">
                Fin:
              </span>
              <span>{formatDate(new Date(project.endDate))}</span>
            </div>
          )}

          {/* Manager */}
          {project.manager && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-semibold text-xs text-muted-foreground">
                Manager:
              </span>
              <span className="text-sm font-medium">{project.manager.name}</span>
            </div>
          )}

          {/* Stats compactos */}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <div className="bg-muted/50 p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Voluntarios</p>
              <p className="text-lg font-bold">{volunteerCount}</p>
            </div>
            <div className="bg-muted/50 p-2 rounded text-center">
              <p className="text-xs text-muted-foreground">Actividades</p>
              <p className="text-lg font-bold">{activityCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
