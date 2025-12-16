import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCreateActivity } from '@/hooks/activity/useCreateActivity';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
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
  projectId: string;
  projectStartDate?: string; // Fecha de inicio del proyecto (YYYY-MM-DD)
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para crear una nueva actividad dentro de un proyecto
 */
export const CreateActivityModal = ({
  open,
  projectId,
  projectStartDate,
  onOpenChange,
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!projectId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Project ID is required to create an activity',
      });
      return;
    }

    try {
      // Use the service via hook — service will snakeify payload
      const now = new Date().toISOString();
      await createActivityMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        status: 'planned',
        createdAt: now,
        updatedAt: now,
      });

      toast({
        title: 'Éxito',
        description: 'Actividad creada correctamente',
      });

      // Invalidate projects as previous behavior did
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.response?.data?.error || error?.message || 'No se pudo crear la actividad',
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
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
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="Ej: Distribución de alimentos"
              required
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe qué se hará en esta actividad..."
              rows={4}
            />
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="date">Fecha de Realización</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) setErrors({ ...errors, date: '' });
              }}
              min={projectStartDate} // No permitir fechas anteriores al inicio del proyecto
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createActivityMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createActivityMutation.isPending}>
              {createActivityMutation.isPending ? 'Creando...' : 'Crear Actividad'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
