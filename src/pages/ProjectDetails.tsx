import { useParams, useNavigate } from 'react-router-dom';
import { useProjectById } from '@/hooks/project/useProjectById';
import { useAuth } from '@/contexts/AuthContext';
import { isCoordinator } from '@/config/permissions';
import { PageLayout } from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit2, Trash2, Users, Calendar, User, Clock } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';
import { Spinner } from '@/components/Spinner';
import { useState } from 'react';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ConfirmDeleteProject } from '@/components/projects/ConfirmDeleteProject';
import { AddVolunteerModal } from '@/components/projects/AddVolunteerModal';
import { useDeleteProject } from '@/hooks/project/useDeleteProject';

/**
 * Página de detalle del proyecto
 * Muestra: info completa, voluntarios, actividades con progreso, timeline, historial
 */
export const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: project, isLoading } = useProjectById(id || '');
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);

  const isCoord = isCoordinator(user?.role);
  const isManager = isCoord || project?.managerId === user?.id;

  if (isLoading) {
    return (
      <PageLayout title="Proyecto" description="Cargando...">
        <div className="flex items-center justify-center min-h-[500px]">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Proyecto" description="No encontrado">
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <h2 className="text-2xl font-bold mb-4">Proyecto no encontrado</h2>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Proyectos
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Calcular progreso general del proyecto
  const projectProgress = project.activities && project.activities.length > 0
    ? Math.round(
        (project.activities.reduce(
          (sum, a) => sum + (a.completedHours || 0),
          0
        ) /
          project.activities.reduce(
            (sum, a) => sum + (a.totalHours || 1),
            0
          )) *
          100
      )
    : 0;

  const handleDelete = () => {
    deleteProject(project.id, {
      onSuccess: () => {
        navigate('/projects');
      },
    });
  };

  return (
    <PageLayout
      title={project.name}
      description={project.description || 'Sin descripción'}
    >
      <div className="space-y-8">
        {/* Header con navegación y acciones */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Proyectos
          </Button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground text-lg">
                {project.description}
              </p>
            </div>

            {isManager && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Fecha de Inicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {project.startDate
                  ? formatDate(new Date(project.startDate))
                  : 'Sin definir'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Fecha de Fin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {project.endDate
                  ? formatDate(new Date(project.endDate))
                  : 'Sin definir'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">{project.manager?.name}</p>
              <p className="text-xs text-muted-foreground">
                {project.manager?.email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{projectProgress}%</p>
              <Progress value={projectProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Secciones tabuladas */}
        <Tabs defaultValue="volunteers" className="w-full">
          <TabsList>
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Voluntarios
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Actividades
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          {/* Tab: Voluntarios */}
          <TabsContent value="volunteers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Voluntarios Asignados ({project.volunteers?.length || 0})
              </h2>
              {isManager && (
                <Button onClick={() => setShowAddVolunteer(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  Agregar Voluntario
                </Button>
              )}
            </div>

            {project.volunteers && project.volunteers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.volunteers.map((volunteer) => (
                  <Card key={volunteer.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <p className="font-bold text-lg">{volunteer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {volunteer.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay voluntarios asignados</p>
                  {isManager && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowAddVolunteer(true)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Agregar Voluntarios
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Actividades */}
          <TabsContent value="activities" className="space-y-4">
            <h2 className="text-2xl font-bold">
              Actividades ({project.activities?.length || 0})
            </h2>

            {project.activities && project.activities.length > 0 ? (
              <div className="space-y-4">
                {project.activities.map((activity) => {
                  const progressPercent = activity.totalHours
                    ? Math.round(
                        (activity.completedHours / activity.totalHours) * 100
                      )
                    : 0;

                  return (
                    <Card key={activity.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{activity.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {activity.description}
                            </p>
                          </div>
                          <Badge
                            variant={
                              activity.status === 'completed'
                                ? 'default'
                                : activity.status === 'in-progress'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {activity.status === 'completed'
                              ? 'Completada'
                              : activity.status === 'in-progress'
                                ? 'En progreso'
                                : 'No iniciada'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Horas */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progreso de Horas</span>
                            <span>
                              {activity.completedHours} / {activity.totalHours}
                              hs
                            </span>
                          </div>
                          <Progress value={progressPercent} />
                        </div>

                        {/* Fecha */}
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{formatDate(new Date(activity.date))}</span>
                        </div>

                        {/* Voluntarios asignados */}
                        {activity.volunteers && activity.volunteers.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">
                              Voluntarios Asignados
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {activity.volunteers.map((vol) => (
                                <Badge key={vol.id} variant="outline">
                                  {vol.name}
                                  {vol.hoursContributed && (
                                    <span className="ml-1 text-xs">
                                      ({vol.hoursContributed}hs)
                                    </span>
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay actividades asignadas a este proyecto</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Timeline */}
          <TabsContent value="timeline" className="space-y-4">
            <h2 className="text-2xl font-bold">Timeline de Actividades</h2>

            {project.activities && project.activities.length > 0 ? (
              <div className="space-y-4">
                {[...project.activities]
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      {/* Línea de tiempo */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.status === 'completed'
                              ? 'bg-green-500'
                              : activity.status === 'in-progress'
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                          }`}
                        />
                        {index < project.activities!.length - 1 && (
                          <div className="w-1 h-12 bg-gray-200 mt-2" />
                        )}
                      </div>

                      {/* Contenido */}
                      <Card className="flex-1">
                        <CardContent className="pt-6">
                          <div className="space-y-2">
                            <p className="font-bold text-lg">
                              {activity.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(new Date(activity.date))}
                            </p>
                            <Badge
                              variant={
                                activity.status === 'completed'
                                  ? 'default'
                                  : activity.status === 'in-progress'
                                    ? 'secondary'
                                    : 'outline'
                              }
                              className="w-fit"
                            >
                              {activity.status === 'completed'
                                ? 'Completada'
                                : activity.status === 'in-progress'
                                  ? 'En progreso'
                                  : 'No iniciada'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sin actividades para mostrar</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Historial */}
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-2xl font-bold">Historial del Proyecto</h2>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Creado el</p>
                    <p className="font-bold text-lg">
                      {formatDate(new Date(project.createdAt))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Actualizado</p>
                    <p className="font-bold text-lg">
                      {formatDate(new Date(project.updatedAt))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Creado por
                    </p>
                    <p className="font-bold">{project.creator?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manager</p>
                    <p className="font-bold">
                      {project.manager?.name || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      <ProjectForm
        open={showEditModal}
        project={project}
        onOpenChange={setShowEditModal}
      />

      <ConfirmDeleteProject
        open={showDeleteConfirm}
        project={project}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <AddVolunteerModal
        open={showAddVolunteer}
        project={project}
        onOpenChange={setShowAddVolunteer}
      />
    </PageLayout>
  );
};

export default ProjectDetails;
