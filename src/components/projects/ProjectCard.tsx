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
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import {
  MoreHorizontal,
  Eye,
  Edit,
  UserPlus,
  Trash2,
  Users,
  CheckSquare,
  Calendar,
  User,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Ban,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  onAction?: (action: 'view' | 'edit' | 'manage' | 'delete', projectId: string) => void;
  onClick?: (projectId: string) => void;
}

/**
 * Card simplificado para mostrar un proyecto - Coherente con Dashboard
 * Diseño minimalista con colores suaves del sistema IDATIS
 */
export const ProjectCard = ({ project, showActions = true, onAction, onClick }: ProjectCardProps) => {
  const navigate = useNavigate();
  const volunteerCount = project.volunteersCount ?? project.volunteers?.length ?? 0;
  const activityCount = project.activitiesCount ?? project.activities?.length ?? 0;

  // Determinar si el proyecto está próximo a terminar
  const isNearExpiry = () => {
    if (!project.endDate) return false;
    const endDate = new Date(project.endDate);
    const today = new Date();
    const daysUntilEnd = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilEnd <= 30 && daysUntilEnd > 0;
  };

  // Obtener display del status combinando status del backend con lógica de fechas
  const getStatusDisplay = () => {
    // Si está cancelado
    if (project.status === 'cancelled') {
      return {
        label: 'Cancelado',
        icon: <Ban className="w-3.5 h-3.5" />,
        variant: 'outline' as const,
        className: 'bg-transparent text-red-600 border-red-600/30 dark:text-red-400 dark:border-red-400/30'
      };
    }

    // Si está completado
    if (project.status === 'completed') {
      return {
        label: 'Completado',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        variant: 'outline' as const,
        className: 'bg-transparent text-emerald-600 border-emerald-600/30 dark:text-emerald-400 dark:border-emerald-400/30'
      };
    }

    // Si está planificado
    if (project.status === 'planned') {
      const hasStarted = project.startDate && new Date(project.startDate) < new Date();
      if (hasStarted) {
        return {
          label: 'Demorado',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          variant: 'outline' as const,
          className: 'bg-transparent text-amber-600 border-amber-600/30 dark:text-amber-400 dark:border-amber-400/30'
        };
      }
      return {
        label: 'Planificado',
        icon: <Calendar className="w-3.5 h-3.5" />,
        variant: 'outline' as const,
        className: 'bg-transparent text-slate-500 border-slate-500/30 dark:text-slate-400 dark:border-slate-400/30'
      };
    }

    // Si está activo
    if (project.status === 'active') {
      if (isNearExpiry()) {
        return {
          label: 'Próximo a terminar',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          variant: 'outline' as const,
          className: 'bg-transparent text-red-600 border-red-600/30 dark:text-red-400 dark:border-red-400/30'
        };
      }
      return {
        label: 'En progreso',
        icon: <Clock className="w-3.5 h-3.5" />,
        variant: 'outline' as const,
        className: 'bg-transparent text-blue-600 border-blue-600/30 dark:text-blue-400 dark:border-blue-400/30'
      };
    }

    // Default (no debería llegar aquí)
    return {
      label: 'Desconocido',
      icon: <Clock className="w-3.5 h-3.5" />,
      variant: 'outline' as const,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
  };

  const handleCardClick = () => {
    if (onClick) return onClick(project.id);
    navigate(`/projects/${project.id}`);
  };

  const handleAction = (action: 'view' | 'edit' | 'manage' | 'delete') => {
    if (onAction) return onAction(action, project.id);
    switch (action) {
      case 'view':
        navigate(`/projects/${project.id}`);
        break;
      case 'edit':
        navigate(`/projects/${project.id}/edit`);
        break;
      case 'manage':
        navigate(`/projects/${project.id}/volunteers`);
        break;
      case 'delete':
        navigate(`/projects/${project.id}`);
        break;
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="flex flex-col overflow-hidden transition-smooth cursor-pointer group shadow-card hover:shadow-hover"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
    >
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-grow">
            <CardTitle className="line-clamp-2 text-base group-hover:text-soft-blue transition-colors">
              {project.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {(() => {
              const status = getStatusDisplay();
              return (
                <Badge variant={status.variant} className={`text-xs whitespace-nowrap flex items-center gap-1 ${status.className}`}>
                  {status.icon}
                  {status.label}
                </Badge>
              );
            })()}

            {showActions && (project.canEdit || project.canManageVolunteers) && (
              <ContextMenu>
                <ContextMenuTrigger onClick={(e) => e.stopPropagation()}>
                  <button 
                    aria-label="Acciones"
                    className="p-1 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => handleAction('view')}>
                    <Eye className="mr-2 w-4 h-4" /> Ver
                  </ContextMenuItem>
                  {project.canEdit && (
                    <ContextMenuItem onSelect={() => handleAction('edit')}>
                      <Edit className="mr-2 w-4 h-4" /> Editar
                    </ContextMenuItem>
                  )}
                  {project.canManageVolunteers && (
                    <ContextMenuItem onSelect={() => handleAction('manage')}>
                      <UserPlus className="mr-2 w-4 h-4" /> Gestionar voluntarios
                    </ContextMenuItem>
                  )}
                  {project.canEdit && (
                    <ContextMenuItem onSelect={() => handleAction('delete')}>
                      <Trash2 className="mr-2 w-4 h-4" /> Eliminar
                    </ContextMenuItem>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col gap-3 pt-4">
        {/* Descripción */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Manager */}
        {project.manager && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-soft-blue flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Responsable:</span>
            <span className="text-sm font-medium text-foreground">{project.manager.name}</span>
          </div>
        )}

        {/* Fechas */}
        <div className="space-y-1 text-sm">
          {(project.startDate || project.endDate) && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-soft-blue flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                {project.startDate && project.endDate ? (
                  <span>
                    {formatDate(new Date(project.startDate))} - 
                    <span className={project.status === 'completed' ? 'line-through' : isNearExpiry() ? 'text-amber-600 font-medium' : ''}>
                      {' ' + formatDate(new Date(project.endDate))}
                    </span>
                  </span>
                ) : project.startDate ? (
                  <span>Inicia: {formatDate(new Date(project.startDate))}</span>
                ) : (
                  <span>Finaliza: {formatDate(new Date(project.endDate!))}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-2 border-t border-border">
          <div className="bg-gradient-soft p-2 rounded border border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-soft-blue" />
            </div>
            <p className="text-lg font-semibold text-foreground">{volunteerCount}</p>
            <p className="text-xs text-muted-foreground">Voluntarios</p>
          </div>
          <div className="bg-gradient-soft p-2 rounded border border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckSquare className="w-3.5 h-3.5 text-soft-green" />
            </div>
            <p className="text-lg font-semibold text-foreground">{activityCount}</p>
            <p className="text-xs text-muted-foreground">Actividades</p>
          </div>
        </div>

        {/* Footer link */}
        <div className="flex items-center gap-1 text-soft-blue text-xs font-medium group-hover:gap-2 transition-all mt-3 opacity-0 group-hover:opacity-100">
          <span>Ver detalles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </CardContent>
    </Card>
  );
};
