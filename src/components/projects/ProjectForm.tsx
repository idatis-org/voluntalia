import { useState, useEffect } from 'react';
import type { Project, CreateProjectDTO } from '@/types/project';
import { useCreateProject } from '@/hooks/project/useCreateProject';
import { useUpdateProject } from '@/hooks/project/useUpdateProject';
import { useAuth } from '@/contexts/AuthContext';
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

interface ProjectFormProps {
  open: boolean;
  project: Project | null; // null = crear, Project = editar
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog para crear o editar un proyecto
 * Incluye validación básica de campos requeridos
 */
export const ProjectForm = ({
  open,
  project,
  onOpenChange,
}: ProjectFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateProjectDTO>({
    name: '',
    managerId: user?.id || '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  const isEdit = !!project;
  const isLoading = isCreating || isUpdating;

  // Rellenar form cuando project cambia
  useEffect(() => {
    if (project && open) {
      // Procesar fechas: si vienen con timestamp, extraer solo YYYY-MM-DD, si son null usar ''
      const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        // Si viene como ISO string con T, extraer parte de fecha
        if (typeof dateStr === 'string' && dateStr.includes('T')) {
          return dateStr.split('T')[0];
        }
        // Si ya es YYYY-MM-DD
        return dateStr;
      };

      setFormData({
        name: project.name,
        managerId: project.managerId,
        description: project.description || '',
        startDate: formatDate(project.startDate),
        endDate: formatDate(project.endDate),
      });
    } else if (!project && open) {
      setFormData({
        name: '',
        managerId: user?.id || '',
        description: '',
        startDate: '',
        endDate: '',
      });
    }
    setErrors({});
  }, [project, open, user?.id]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre del proyecto es requerido';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.dates = 'La fecha de inicio no puede ser posterior a la fecha de fin';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEdit && project) {
      updateProject(
        { id: project.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
    } else {
      createProject(formData, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="Ej: Proyecto Solidario 2025"
              required
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe el objetivo del proyecto..."
              rows={4}
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  if (errors.dates) setErrors({ ...errors, dates: '' });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  if (errors.dates) setErrors({ ...errors, dates: '' });
                }}
              />
            </div>
          </div>

          {errors.dates && (
            <p className="text-xs text-destructive">{errors.dates}</p>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEdit
                  ? 'Actualizar'
                  : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
