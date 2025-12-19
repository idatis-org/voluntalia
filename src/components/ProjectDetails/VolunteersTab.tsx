import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Project } from "@/types/project";
import { VolunteerCard } from "@/components/volunteers/VolunteerCard";

interface VolunteersTabProps {
  project: Project;
  onAddVolunteer: () => void;
  onViewProfile: (volunteer: any) => void;
  onContact: (volunteer: any, method: string) => void;
}

export const VolunteersTab: React.FC<VolunteersTabProps> = ({
  project,
  onAddVolunteer,
  onViewProfile,
  onContact,
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Equipo de Voluntarios</h2>
          <p className="text-sm text-muted-foreground">{project.volunteers?.length ?? 0} personas asignadas a este proyecto</p>
        </div>
        <Button onClick={onAddVolunteer} className="bg-gradient-primary shadow-sm">
          <Users className="w-4 h-4 mr-2" /> Agregar
        </Button>
      </div>

      {project.volunteers && project.volunteers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.volunteers.map(v => (
            <VolunteerCard
              key={v.id}
              volunteer={v}
              onViewProfile={onViewProfile}
              onManageActivities={() => {}}
              onContact={onContact}
              onDelete={() => {}}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-background rounded-full p-4 mb-4 shadow-sm">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No hay voluntarios asignados</p>
            <Button variant="link" onClick={onAddVolunteer} className="text-soft-blue">
              Asignar el primero ahora
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};
