import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useCreateActivity } from '@/hooks/activity/useCreateActivity';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/project/useProjects';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CreateActivityModalProps {
  open: boolean;
  projectId?: string;
  projectStartDate?: string; // Fecha de inicio del proyecto (YYYY-MM-DD)
  onOpenChange: (open: boolean) => void;
  onCreated?: (activity: any) => void;
}

/**
 * Reusable modal para crear una nueva actividad.
 * `projectId` es opcional — si se provee la actividad se asociará al proyecto.
 */
export const CreateActivityModal = ({
  open,
  projectId,
  projectStartDate,
  onOpenChange,
  onCreated,
}: CreateActivityModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Use mutation loading state instead of local loading state
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createActivityMutation = useCreateActivity();
  const { user } = useAuth();
  const { data } = useProjects();
  // `useProjects` may return an array (legacy) or an object { projects, meta }
  const allProjects = Array.isArray(data) ? data : (data && typeof data === 'object' && 'projects' in data ? (data as any).projects : []);

  const isCoordinator = user?.role === 'COORDINATOR';
  const isProjectManager = user?.role === 'PROJECT_MANAGER';

  // If user is project manager, determine their managed project
  const managerProject = allProjects.find((p: any) => (p.managerId ?? p.manager?.id) === user?.id);

  // local state for selected project id (can be overridden by prop)
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(projectId ?? (isProjectManager ? managerProject?.id : undefined));
  // local editable input for project name to allow typing and searching
  const [projectInput, setProjectInput] = useState<string>(
    allProjects.find((p: any) => p.id === (selectedProjectId ?? projectId))?.name ?? ''
  );

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
      return;
    }
    if (isProjectManager && managerProject?.id) {
      setSelectedProjectId(managerProject.id);
      return;
    }
    setSelectedProjectId(undefined);
  }, [projectId, isProjectManager, managerProject?.id]);

  // keep the editable project input in sync with selectedProjectId / projectId
  useEffect(() => {
    const name = allProjects.find((p: any) => p.id === (selectedProjectId ?? projectId))?.name ?? '';
    setProjectInput(name);
  }, [selectedProjectId, projectId, allProjects]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }

    // Validar que la fecha de la actividad no sea anterior a la del proyecto
    if (projectStartDate && formData.date) {
      if (new Date(formData.date) < new Date(projectStartDate)) {
        newErrors.date = `La actividad no puede ser antes del ${projectStartDate} (inicio del proyecto)`;
      }
    }

    // If user is PROJECT_MANAGER, ensure they have an assigned project
    if (isProjectManager && !selectedProjectId) {
      newErrors.project = 'You do not have a project assigned to create activities.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Build payload — include projectId only if provided
      const now = new Date().toISOString();
      const payload: any = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        status: 'planned',
        createdAt: now,
        updatedAt: now,
      };
      const finalProjectId = selectedProjectId ?? projectId;
      if (finalProjectId) payload.projectId = finalProjectId;

      const created = await createActivityMutation.mutateAsync(payload);

      toast({ title: 'Éxito', description: 'Actividad creada correctamente' });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });

      setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
      setErrors({});
      onOpenChange(false);

      if (onCreated) onCreated(created);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error?.response?.data?.error || error?.message || 'No se pudo crear la actividad' });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
      setErrors({});
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Actividad</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
            <Input id="title" value={formData.title} onChange={(e) => { setFormData({ ...formData, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: '' }); }} placeholder="Ej: Distribución de alimentos" required className={errors.title ? 'border-destructive' : ''} />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe qué se hará en esta actividad..." rows={4} />
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="date">Fecha de inicio</Label>
            <Input id="date" type="date" value={formData.date} onChange={(e) => { setFormData({ ...formData, date: e.target.value }); if (errors.date) setErrors({ ...errors, date: '' }); }} min={projectStartDate} className={errors.date ? 'border-destructive' : ''} />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>

          {/* Project selector / display */}
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            {isCoordinator ? (
              <div className="flex flex-col">
                <input
                  list="projects-list-modal"
                  id="project"
                  className="mt-1 block w-full rounded-md border px-2 py-1 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100"
                  value={projectInput}
                  onChange={(e) => {
                    const name = e.target.value;
                    setProjectInput(name);
                    const found = allProjects.find((p: any) => p.name === name);
                    setSelectedProjectId(found ? found.id : undefined);
                    if (errors.project) setErrors({ ...errors, project: '' });
                  }}
                  placeholder="Type to search projects"
                />
                <datalist id="projects-list-modal">{allProjects.map((p: any) => <option key={p.id} value={p.name} />)}</datalist>
                {errors.project && <p className="text-xs text-destructive">{errors.project}</p>}
              </div>
            ) : isProjectManager ? (
              <div>
                <Input id="project" value={managerProject?.name ?? ''} disabled className="mt-1" />
                {!managerProject && <p className="text-xs text-destructive">You are not assigned as manager to any project.</p>}
              </div>
            ) : projectId ? (
              <div>
                <Input id="project" value={allProjects.find((p: any) => p.id === projectId)?.name ?? ''} disabled className="mt-1" />
              </div>
            ) : (
              <div className="flex flex-col">
                <input
                  list="projects-list-modal"
                  id="project"
                  className="mt-1 block w-full rounded-md border px-2 py-1 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100"
                  value={projectInput}
                  onChange={(e) => {
                    const name = e.target.value;
                    setProjectInput(name);
                    const found = allProjects.find((p: any) => p.name === name);
                    setSelectedProjectId(found ? found.id : undefined);
                    if (errors.project) setErrors({ ...errors, project: '' });
                  }}
                  placeholder="(optional) Type to search projects"
                />
                <datalist id="projects-list-modal">{allProjects.map((p: any) => <option key={p.id} value={p.name} />)}</datalist>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            {/* react-query naming varies by version: normalize to a safe `isSubmitting` flag */}
            {(() => {
              const isSubmitting = (createActivityMutation as any).isLoading ?? (createActivityMutation as any).isPending ?? false;
              return (
                <>
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>Cancelar</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creando...' : 'Crear Actividad'}</Button>
                </>
              );
            })()}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
