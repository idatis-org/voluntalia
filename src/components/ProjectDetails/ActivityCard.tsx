import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";
import { Popover as PopoverPrimitive, PopoverTrigger as PopoverTriggerPrimitive, PopoverContent as PopoverContentPrimitive } from "@/components/ui/popover";
import { formatDate } from "@/lib/formatDate";
import { WorkLog } from "@/types/workLog";
import { ActivityTask } from "@/types/activity";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ActivityCardProps {
  activity: ActivityTask;
  isCompleted: boolean;
  pendingCount: number;
  pendingEntries: WorkLog[];
  onViewLogs: (activity: ActivityTask) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isCompleted,
  pendingCount,
  pendingEntries,
  onViewLogs,
}) => {
  const { toast } = useToast();

  return (
    <Card key={activity.id} className="relative group hover:border-soft-blue/30 transition-all duration-300 overflow-hidden">
      <div className="flex items-stretch">
        <div className={cn(
          "w-1.5 shrink-0",
          isCompleted ? "bg-emerald-500" : activity.status === 'active' ? "bg-soft-blue" : "bg-muted"
        )} />
        <div className="flex-grow p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg group-hover:text-soft-blue transition-colors">{activity.title}</h3>
                <Badge variant={isCompleted ? "secondary" : "outline"} className={cn(
                  "text-[10px] px-1.5 py-0 h-5",
                  isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-100" : ""
                )}>
                  {activity.status === 'completed' ? 'Completada' : activity.status === 'active' ? 'En curso' : 'Pendiente'}
                </Badge>
                {pendingCount > 0 && (
                  <PopoverPrimitive>
                    <PopoverTriggerPrimitive asChild>
                      <button aria-label={`Pendientes ${pendingCount} para ${activity.title}`} className="ml-2 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow hover:bg-amber-600 hover:shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer">{pendingCount}</button>
                    </PopoverTriggerPrimitive>
                    <PopoverContentPrimitive align="start" className="w-80 p-3">
                      <div className="space-y-3">
                        {pendingEntries.slice(0, 3).map(entry => (
                          <div key={entry.id} className="p-2 border rounded-md">
                            <p className="text-sm font-medium">{entry.activity?.title || entry.activityTitle || 'Actividad'}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{entry.notes}</p>
                            <p className="text-xs text-muted-foreground mt-1">{entry.hours?.hours ?? 0}h — {entry.weekStart ? formatDate(new Date(entry.weekStart)) : 'Sin fecha'}</p>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onViewLogs(activity)}>
                          Ver todos los logs
                        </Button>
                      </div>
                    </PopoverContentPrimitive>
                  </PopoverPrimitive>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{activity.description}</p>
            </div>
            <div className="flex flex-col items-end shrink-0 mr-8">
              <span className="text-lg font-black text-soft-blue leading-none">{activity.completedHours ?? 0}h</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Registradas</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{activity.date ? formatDate(new Date(activity.date)) : 'Sin fecha'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                {isCompleted ? '100%' : activity.status === 'active' ? '50%' : '0%'}
              </span>
              <div className="w-24">
                <Progress value={isCompleted ? 100 : activity.status === 'active' ? 50 : 0} className="h-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
