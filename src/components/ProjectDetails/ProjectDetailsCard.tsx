import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar } from "lucide-react";
import { User } from "@/types/user";
import { formatDate } from "@/lib/formatDate";

interface ProjectDetailsCardProps {
  manager: User | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
}

export const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({
  manager,
  startDate,
  endDate,
}) => {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detalles del Proyecto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="bg-soft-blue/10 p-2 rounded-lg shrink-0">
            <Calendar className="w-4 h-4 text-soft-blue" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Periodo</p>
            <p className="text-sm font-bold">
              {startDate ? formatDate(new Date(startDate)) : 'TBD'}
              <span className="mx-1 text-muted-foreground font-normal">—</span>
              {endDate ? formatDate(new Date(endDate)) : 'TBD'}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground font-medium mb-3">Responsable</p>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarFallback className="bg-soft-blue/10 text-soft-blue font-bold">
                {manager?.name?.substring(0, 2).toUpperCase() || 'PM'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold truncate">{manager?.name || 'Sin asignar'}</p>
              <p className="text-xs text-muted-foreground truncate">{manager?.email}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => manager?.email && (window.location.href = `mailto:${manager.email}`)}>
              <Mail className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <Phone className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
