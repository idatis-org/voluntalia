import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";
import { Project } from "@/types/project";
import { WorkLog } from "@/types/workLog";
import { ActivityCard } from "./ActivityCard";

interface ActivitiesTabProps {
  project: Project;
  worklog: WorkLog[];
  onAddActivity: () => void;
  onLogHours: () => void;
  onViewLogs: (activity: any) => void;
}

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({
  project,
  worklog,
  onAddActivity,
  onLogHours,
  onViewLogs,
}) => {
  const pendingForProject = (worklog || []).filter(w => {
    if (!w || w.status !== 'pending') return false;
    const activityId = w.activity?.id ?? null;
    return !!project.activities?.some(a => String(a.id) === String(activityId) || String(a.id) === String(w.activityTitle));
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Plan de Actividades</h2>
          <p className="text-sm text-muted-foreground">Gestión de tareas y objetivos del proyecto</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onLogHours} className="border-soft-blue text-soft-blue hover:bg-soft-blue/5">
            <ListTodo className="w-4 h-4 mr-2" /> Registrar Horas
          </Button>
          <Button onClick={onAddActivity} className="bg-gradient-primary shadow-sm">
            <ListTodo className="w-4 h-4 mr-2" /> Nueva Actividad
          </Button>
        </div>
      </div>

      {project.activities && project.activities.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {project.activities.map(a => {
            const isCompleted = a.status === 'completed';
            const pendingCount = pendingForProject.filter(p => String(p.activity?.id) === String(a.id) || String(p.activityTitle) === String(a.id)).length;
            const activityPending = pendingForProject.filter(p => String(p.activity?.id) === String(a.id) || String(p.activityTitle) === String(a.id));

            return (
              <ActivityCard
                key={a.id}
                activity={a}
                isCompleted={isCompleted}
                pendingCount={pendingCount}
                pendingEntries={activityPending}
                onViewLogs={onViewLogs}
              />
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-background rounded-full p-4 mb-4 shadow-sm">
              <ListTodo className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No hay actividades programadas</p>
            <Button variant="link" onClick={onAddActivity} className="text-soft-blue">
              Crear la primera actividad
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};
