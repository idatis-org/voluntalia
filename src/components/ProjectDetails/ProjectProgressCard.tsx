import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LayoutDashboard } from "lucide-react";

interface ProjectProgressCardProps {
  currentWeek: number;
  totalWeeks: number;
  totalHours: number;
  weekProgress: number;
  activities: { status: string }[];
}

export const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({
  currentWeek,
  totalWeeks,
  totalHours,
  weekProgress,
  activities,
}) => {
  const completed = activities.filter(a => a.status === 'completed').length;

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-soft-blue to-soft-purple text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Progreso General</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-black">{totalHours} hs</span>
            <span className="text-sm opacity-80 mb-1">Registradas</span>
          </div>
          <Progress value={weekProgress} className="h-2 bg-white/20" />
          {/* <p className="text-xs opacity-70 leading-relaxed">
            {activities.length} actividades totales. {completed} finalizadas.
          </p> */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="opacity-80">Semana actual</span>
              <span className="font-bold">{currentWeek} / {totalWeeks}</span>
            </div>
            {/* <div className="flex justify-between items-center text-xs">
              <span className="opacity-80">Total de actividades</span>
              <span className="font-bold">{activities.length}</span>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
