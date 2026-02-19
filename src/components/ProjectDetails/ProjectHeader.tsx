import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  History,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
  project: Project;
  isUpdatingStatus: boolean;
  onStatusChange: (status: 'planned' | 'active' | 'completed' | 'cancelled') => void;
  onEdit: () => void;
  onDelete: () => void;
  onNavigateBack: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  isUpdatingStatus,
  onStatusChange,
  onEdit,
  onDelete,
  onNavigateBack,
}) => {
  const getStatusDisplay = () => {
    if (project.status === 'completed') return { label: 'Completado', color: 'bg-transparent text-emerald-600 border-emerald-600/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
    if (project.status === 'cancelled') return { label: 'Cancelado', color: 'bg-transparent text-red-600 border-red-600/30', icon: <AlertCircle className="w-3.5 h-3.5" /> };

    const hasStarted = project.startDate && new Date(project.startDate) < new Date();
    if (project.status === 'planned' && hasStarted) return { label: 'Demorado', color: 'bg-transparent text-amber-600 border-amber-600/30', icon: <AlertCircle className="w-3.5 h-3.5" /> };

    if (project.status === 'active') return { label: 'En Progreso', color: 'bg-transparent text-blue-600 border-blue-600/30', icon: <Clock className="w-3.5 h-3.5" /> };

    return { label: 'Planificado', color: 'bg-transparent text-slate-500 border-slate-500/30', icon: <Calendar className="w-3.5 h-3.5" /> };
  };

  const status = getStatusDisplay();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-soft-blue/5 via-background to-soft-purple/5 border border-border p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <button onClick={onNavigateBack} className="hover:text-soft-blue transition-colors">Proyectos</button>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-foreground truncate max-w-[200px]">{project.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{project.name}</h1>
            {status && (
              <Badge
                variant="outline"
                className={cn(
                  "px-2.5 py-0.5 flex items-center gap-1.5 font-medium",
                  status.color
                )}
              >
                {status.icon}
                {status.label}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            {project.description || 'Este proyecto no tiene una descripción detallada todavía.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm" disabled={isUpdatingStatus}>
                <History className="w-4 h-4 mr-2" />
                {isUpdatingStatus ? 'Actualizando...' : 'Cambiar Estado'}
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onStatusChange('planned')}
                className="flex items-center gap-2"
                disabled={project.status === 'planned'}
              >
                <Calendar className="w-4 h-4 text-slate-500" /> Planificado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange('active')}
                className="flex items-center gap-2"
                disabled={project.status === 'active'}
              >
                <Clock className="w-4 h-4 text-blue-500" /> En Progreso
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange('completed')}
                className="flex items-center gap-2"
                disabled={project.status === 'completed'}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completado
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onStatusChange('cancelled')}
                className="flex items-center gap-2 text-destructive focus:text-destructive"
                disabled={project.status === 'cancelled'}
              >
                <AlertCircle className="w-4 h-4" /> Cancelado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="bg-background/50 backdrop-blur-sm"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};
