import { useState, useEffect } from 'react';
import type { Project, CreateProjectDTO } from '@/types/project';
import { useCreateProject } from '@/hooks/project/useCreateProject';
import { useUpdateProject } from '@/hooks/project/useUpdateProject';
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
  const [formData, setFormData] = useState<CreateProjectDTO>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  const isEdit = !!project;
  const isLoading = isCreating || isUpdating;

  // Rellenar form cuando project cambia
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
      });
    }
    setErrors({});
  }, [project, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre del proyecto es requerido';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
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
              <Label htmlFor="start_date">Fecha de Inicio</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => {
                  setFormData({ ...formData, start_date: e.target.value });
                  if (errors.dates) setErrors({ ...errors, dates: '' });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha de Fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => {
                  setFormData({ ...formData, end_date: e.target.value });
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
