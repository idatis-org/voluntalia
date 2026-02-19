import { Project } from "@/types/project";

interface ProjectQuickStatsProps {
  project: Project;
}

export const ProjectQuickStats: React.FC<ProjectQuickStatsProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
        <p className="text-2xl font-black text-soft-blue">{project.volunteers?.length || 0}</p>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Voluntarios</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm">
        <p className="text-2xl font-black text-soft-purple">{project.activities?.length || 0}</p>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Actividades</p>
      </div>
    </div>
  );
};
