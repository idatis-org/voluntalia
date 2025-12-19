import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, ListTodo, Users, History } from 'lucide-react';
import { Spinner } from '@/components/Spinner';
import { useProjectById } from '@/hooks/project/useProjectById';
import { useWorkLog } from '@/hooks/workLog/useWorkLog';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';
import { useUpdateProject } from '@/hooks/project/useUpdateProject';
import { useToast } from '@/hooks/use-toast';
import { AddVolunteerModal } from '@/components/projects/AddVolunteerModal';
import { CreateActivityModal } from '@/components/modals/CreateActivityModal';
import { LogHoursModal } from '@/components/modals/LogHoursModal';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

import { ProjectHeader } from '@/components/ProjectDetails/ProjectHeader';
import { ProjectProgressCard } from '@/components/ProjectDetails/ProjectProgressCard';
import { ProjectDetailsCard } from '@/components/ProjectDetails/ProjectDetailsCard';
import { ProjectQuickStats } from '@/components/ProjectDetails/ProjectQuickStats';
import { ActivitiesTab } from '@/components/ProjectDetails/ActivitiesTab';
import { VolunteersTab } from '@/components/ProjectDetails/VolunteersTab';
import { TimelineTab } from '@/components/ProjectDetails/TimelineTab';

const ProjectDetails = (): JSX.Element => {
  // Helper: Get Monday of the week containing a given date
  const getMondayOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Helper: Calculate total weeks between two dates (Monday-Sunday weeks)
  const getWeeksBetween = (startDate: Date, endDate: Date): number => {
    const start = getMondayOfWeek(startDate);
    const end = getMondayOfWeek(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  };

  // Helper: Calculate current week number in project
  const getCurrentWeek = (startDate: Date): number => {
    const today = new Date();
    const projectStart = getMondayOfWeek(startDate);
    const thisWeekMonday = getMondayOfWeek(today);
    const diffTime = thisWeekMonday.getTime() - projectStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
  };

  // Helper: Calculate total hours logged
  const getTotalHours = (): number => {
    return (worklog || []).reduce((sum, w) => {
      const hours = typeof w.hours?.hours === 'number' ? w.hours.hours : 0;
      return sum + hours;
    }, 0);
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, refetch } = useProjectById(id || '');
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: updateProject, isPending: isUpdatingStatus } = useUpdateProject();
  const { toast } = useToast();
  const { data: worklog = [] } = useWorkLog();

  const [showAddVolunteer, setShowAddVolunteer] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showLogHours, setShowLogHours] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Hardcoded pending entries for now (until endpoint is ready)
  const pendingForProject = useMemo(() => {
    if (!project?.activities || project.activities.length === 0) return [];
    
    // Hardcoded mock data
    const source: any[] = [
      {
        id: 'mock-1',
        status: 'pending',
        activity: { id: project.activities[0].id, title: project.activities[0].title },
        activityTitle: project.activities[0].title,
        notes: 'Registro de ejemplo pendiente',
        hours: { hours: 3 },
        weekStart: new Date().toISOString(),
      },
    ];
    
    if (project.activities.length > 1) {
      source.push({
        id: 'mock-2',
        status: 'pending',
        activity: { id: project.activities[1].id, title: project.activities[1].title },
        activityTitle: project.activities[1].title,
        notes: 'Otro registro de ejemplo',
        hours: { hours: 1.5 },
        weekStart: new Date().toISOString(),
      });
    }
    
    return source;
  }, [project?.activities]);

  const handleStatusChange = (newStatus: 'planned' | 'active' | 'completed' | 'cancelled') => {
    if (!project) return;
    updateProject(
      { id: project.id, data: { status: newStatus } },
      { onSuccess: () => refetch() }
    );
  };

  const handleDelete = () => {
    if (!project) return;
    deleteProject(project.id, { onSuccess: () => navigate('/projects') });
  };

  const handleViewLogs = (activity: any) => {
    toast({ title: 'En desarrollo', description: 'Página de logs de actividad próximamente.' });
  };

  if (isLoading) {
    return (
      <PageLayout title="Proyecto" description="Cargando detalles...">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Spinner />
          <p className="text-muted-foreground animate-pulse">Obteniendo información del proyecto...</p>
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Proyecto" description="No encontrado">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="bg-muted rounded-full p-6 mb-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Proyecto no encontrado</h2>
          <p className="text-muted-foreground mb-6 max-w-md">El proyecto que buscas no existe o ha sido eliminado permanentemente.</p>
          <Button onClick={() => navigate('/projects')} variant="outline">
            Volver a Proyectos
          </Button>
        </div>
      </PageLayout>
    );
  }

  const currentWeek = project.startDate ? getCurrentWeek(new Date(project.startDate)) : 0;
  const totalWeeks = project.startDate && project.endDate ? getWeeksBetween(new Date(project.startDate), new Date(project.endDate)) : 0;
  const totalHours = getTotalHours();
  const weekProgress = project.startDate && project.endDate ? Math.min((currentWeek / totalWeeks) * 100, 100) : 0;

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <ProjectHeader
          project={project}
          isUpdatingStatus={isUpdatingStatus}
          onStatusChange={handleStatusChange}
          onEdit={() => setShowEditProject(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
          onNavigateBack={() => navigate('/projects')}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Tabs & Content (70%) */}
          <div className="lg:col-span-8 space-y-6">
            <Tabs defaultValue="activities" className="w-full">
              <TabsList className="w-full justify-start bg-muted/50 p-1 mb-6">
                <TabsTrigger value="activities" className="flex items-center gap-2 px-6">
                  <ListTodo className="w-4 h-4" /> Actividades
                </TabsTrigger>
                <TabsTrigger value="volunteers" className="flex items-center gap-2 px-6">
                  <Users className="w-4 h-4" /> Voluntarios
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2 px-6">
                  <History className="w-4 h-4" /> Timeline
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="space-y-6 outline-none">
                <ActivitiesTab
                  project={project}
                  worklog={pendingForProject}
                  onAddActivity={() => setShowAddActivity(true)}
                  onLogHours={() => setShowLogHours(true)}
                  onViewLogs={handleViewLogs}
                />
              </TabsContent>

              <TabsContent value="volunteers" className="space-y-6 outline-none">
                <VolunteersTab
                  project={project}
                  onAddVolunteer={() => setShowAddVolunteer(true)}
                  onViewProfile={(vol) => navigate(`/volunteers/${vol.id}`)}
                  onContact={(vol, method) => {
                    if (method === 'email') window.location.href = `mailto:${vol.email}`;
                    else toast({ title: 'Contacto', description: `Tel: ${vol.phone || 'No disponible'}` });
                  }}
                />
              </TabsContent>

              <TabsContent value="timeline" className="outline-none">
                <TimelineTab project={project} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Sidebar Info (30%) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Progress Card */}
            <ProjectProgressCard
              currentWeek={currentWeek}
              totalWeeks={totalWeeks}
              totalHours={totalHours}
              weekProgress={weekProgress}
              activities={project.activities || []}
            />

            {/* Details Card */}
            <ProjectDetailsCard
              manager={project.manager}
              startDate={project.startDate}
              endDate={project.endDate}
            />

            {/* Quick Stats */}
            <ProjectQuickStats project={project} />
          </div>
        </div>

        {/* Modals */}
        <AddVolunteerModal
          open={showAddVolunteer}
          project={project}
          onOpenChange={setShowAddVolunteer}
        />
        <CreateActivityModal
          open={showAddActivity}
          projectId={project.id}
          projectStartDate={project.startDate ?? undefined}
          onOpenChange={setShowAddActivity}
        />
        <LogHoursModal
          open={showLogHours}
          onOpenChange={setShowLogHours}
          activities={project.activities || []}
          onSuccess={refetch}
        />
        <ProjectForm
          open={showEditProject}
          project={project}
          onOpenChange={setShowEditProject}
          onSuccess={refetch}
        />
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="¿Eliminar proyecto?"
          description="Esta acción no se puede deshacer. Se eliminarán todas las actividades y registros asociados a este proyecto."
          confirmText="Eliminar Proyecto"
          variant="destructive"
        />
      </div>
    </PageLayout>
  );
};

export default ProjectDetails;
