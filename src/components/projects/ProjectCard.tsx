import { Project } from '@/types/project';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, Users } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onAddVolunteer: (project: Project) => void;
  isManager?: boolean; // Si el usuario actual es manager del proyecto
}

/**
 * Card individual para mostrar un proyecto
 * Muestra: nombre, descripción, fechas, manager, voluntarios
 * Acciones: editar, eliminar, agregar voluntarios
 */
export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onAddVolunteer,
  isManager = false,
}: ProjectCardProps) => {
  const volunteerCount = project.volunteers?.length || 0;
  const activityCount = project.activities?.length || 0;

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="line-clamp-2 text-lg">{project.name}</CardTitle>
          <CardDescription className="line-clamp-3 text-sm">
            {project.description || 'Sin descripción'}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="space-y-3 text-sm">
          {/* Fechas */}
          {project.startDate && (
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs text-muted-foreground">
                Inicio:
              </span>
              <span>{formatDate(new Date(project.startDate))}</span>
            </div>
          )}

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
            <div className="flex justify-between items-center pt-1 border-t">
              <span className="font-semibold text-xs text-muted-foreground">
                Manager:
              </span>
              <span className="text-sm">{project.manager.name}</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-muted p-2 rounded">
              <p className="text-xs font-semibold text-muted-foreground">
                Voluntarios
              </p>
              <p className="text-lg font-bold">{volunteerCount}</p>
            </div>
            <div className="bg-muted p-2 rounded">
              <p className="text-xs font-semibold text-muted-foreground">
                Actividades
              </p>
              <p className="text-lg font-bold">{activityCount}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onAddVolunteer(project)}
        >
          <Users className="w-4 h-4 mr-2" />
          Voluntarios
        </Button>

        {isManager && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(project)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive"
              onClick={() => onDelete(project)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
