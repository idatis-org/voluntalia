import { CheckCircle2 } from "lucide-react";
import { Project } from "@/types/project";
import { formatDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

interface TimelineTabProps {
  project: Project;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ project }) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Línea de Tiempo</h2>
        <p className="text-sm text-muted-foreground">Cronología de eventos y actividades</p>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-border">
        {[...(project.activities ?? [])]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((act) => (
            <div key={act.id} className="relative">
              <div className={cn(
                "absolute -left-[27px] mt-1.5 w-4 h-4 rounded-full border-2 border-background z-10",
                act.status === 'completed' ? "bg-emerald-500" : "bg-soft-blue"
              )} />
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="text-xs font-bold text-soft-blue uppercase tracking-wider">
                    {act.date ? formatDate(new Date(act.date)) : 'Pendiente'}
                  </span>
                  {act.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="font-bold text-foreground">{act.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{act.description}</p>
              </div>
            </div>
          ))}

        {(!project.activities || project.activities.length === 0) && (
          <p className="text-muted-foreground text-center py-8">No hay eventos para mostrar en el timeline.</p>
        )}
      </div>
    </>
  );
};
