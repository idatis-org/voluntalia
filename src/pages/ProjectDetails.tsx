import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Users, Clock } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { formatDate } from '@/lib/formatDate';
import { useProjectById } from '@/hooks/project/useProjectById';
import { VolunteerCard } from '@/components/volunteers/VolunteerCard';
import { AddVolunteerModal } from '@/components/projects/AddVolunteerModal';
import { CreateActivityModal } from '@/components/modals/CreateActivityModal';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

    const ProjectDetails = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProjectById(id || '');
  const { mutate: deleteProject } = useDeleteProject();
  const { toast } = useToast();

  const [showAddVolunteer, setShowAddVolunteer] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);

  if (isLoading) {
    return (
      <PageLayout title="Proyecto" description="Cargando...">
        <div className="flex items-center justify-center min-h-[400px]"><Spinner /></div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Proyecto" description="No encontrado">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold mb-4">Proyecto no encontrado</h2>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a Proyectos
          </Button>
        </div>
      </PageLayout>
    );
  }

  const projectProgress = project.activities && project.activities.length > 0
    ? Math.round(
        ((project.activities.filter(a => a.status === 'completed').length) /
         project.activities.length) * 100
      )
    : 0;

  const handleViewProfile = (volunteer: User) => {
    navigate(`/volunteers/${volunteer.id}`);
  };

  const handleManageActivities = (volunteer: User) => {
    toast({
      title: 'Info',
      description: `Managing activities for ${volunteer.name}`,
    });
  };

  const handleContact = (volunteer: User, method: 'email' | 'phone') => {
    if (method === 'email') {
      window.location.href = `mailto:${volunteer.email}`;
    } else {
      toast({
        title: 'Info',
        description: `Phone: ${volunteer.phone || 'Not available'}`,
      });
    }
  };

  const handleDeleteVolunteer = (volunteerId: string) => {
    toast({
      title: 'Info',
      description: 'Delete volunteer functionality coming soon',
    });
  };

  return (
    <PageLayout title={project.name} description={project.description || 'Sin descripción'}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </Button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader><CardTitle>Fecha Inicio</CardTitle></CardHeader>
            <CardContent>{project.startDate ? formatDate(new Date(project.startDate)) : 'Sin definir'}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Fecha Fin</CardTitle></CardHeader>
            <CardContent>{project.endDate ? formatDate(new Date(project.endDate)) : 'Sin definir'}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Manager</CardTitle></CardHeader>
            <CardContent>{project.manager?.name}<div className="text-xs text-muted-foreground">{project.manager?.email}</div></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Progreso</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectProgress}%</div>
              <Progress value={projectProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="volunteers">
          <TabsList>
            <TabsTrigger value="volunteers" className="flex items-center gap-2"><Users className="w-4 h-4"/> Voluntarios</TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Actividades</TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2"><Clock className="w-4 h-4"/> Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="volunteers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Voluntarios ({project.volunteers?.length ?? 0})</h2>
              <Button onClick={() => setShowAddVolunteer(true)}>Agregar Voluntario</Button>
            </div>
            {project.volunteers && project.volunteers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.volunteers.map(v => (
                  <VolunteerCard 
                    key={v.id} 
                    volunteer={v}
                    onViewProfile={handleViewProfile}
                    onManageActivities={handleManageActivities}
                    onContact={handleContact}
                    onDelete={handleDeleteVolunteer}
                  />
                ))}
              </div>
            ) : (
              <Card><CardContent className="text-center">No hay voluntarios asignados</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Actividades ({project.activities?.length ?? 0})</h2>
              <Button onClick={() => setShowAddActivity(true)}>Agregar Actividad</Button>
            </div>
            {project.activities && project.activities.length > 0 ? (
              <div className="space-y-4">
                {project.activities.map(a => {
                  const progress = a.status === 'completed' ? 100 : a.status === 'active' ? 50 : 0;
                  return (
                    <Card key={a.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{a.title}</CardTitle>
                            <div className="text-sm text-muted-foreground">{a.description}</div>
                          </div>
                          <Badge>{a.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm">{a.completedHours ?? 0} hs completadas</div>
                          <div className="text-sm text-muted-foreground">{a.date && formatDate(new Date(a.date))}</div>
                        </div>
                        <Progress value={progress} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card><CardContent className="text-center">No hay actividades</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="timeline">
            <h3 className="text-lg font-bold">Timeline</h3>
            <div className="space-y-2">
              {[...(project.activities ?? [])].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(act => (
                <div key={act.id} className="p-3 border rounded">
                  <div className="font-semibold">{act.title}</div>
                  <div className="text-sm text-muted-foreground">{act.date && formatDate(new Date(act.date))}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <AddVolunteerModal open={showAddVolunteer} project={project} onOpenChange={setShowAddVolunteer} />
        <CreateActivityModal open={showAddActivity} projectId={project.id} projectStartDate={project.startDate ?? undefined} onOpenChange={setShowAddActivity} />
      </div>
    </PageLayout>
  );
};

export default ProjectDetails;
