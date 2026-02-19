import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, Plus } from 'lucide-react';
import { useCreateWorkLog } from '@/hooks/workLog/useCreateWorkLog';
import { useUpdateWorklog } from '@/hooks/workLog/useUpdateWorkLog';
import { ActivityTask } from '@/types/activity';
import { WorkLog } from '@/types/workLog';
import { useToast } from '@/hooks/use-toast';

interface LogHoursModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: ActivityTask[];
  editingEntry?: WorkLog | null;
  onSuccess?: () => void;
}

export const LogHoursModal = ({
  open,
  onOpenChange,
  activities,
  editingEntry,
  onSuccess,
}: LogHoursModalProps) => {
  const { toast } = useToast();
  const { mutate: createWorkLog, isPending: isCreating } = useCreateWorkLog();
  const { mutate: updateWorkLog, isPending: isUpdating } = useUpdateWorklog();

  const isPending = isCreating || isUpdating;
  const isEdit = !!editingEntry;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    activity: null as ActivityTask | null,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when opening or editingEntry changes
  useEffect(() => {
    if (open) {
      if (editingEntry) {
        setFormData({
          date: editingEntry.weekStart ? editingEntry.weekStart.split('T')[0] : new Date().toISOString().split('T')[0],
          hours: String(editingEntry.hours?.hours || ''),
          activity: editingEntry.activity,
          description: editingEntry.notes || '',
        });
      } else {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          hours: '',
          activity: activities.length > 0 ? activities[0] : null,
          description: '',
        });
      }
      setErrors({});
    }
  }, [open, editingEntry, activities]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.hours || parseFloat(formData.hours) <= 0) {
      newErrors.hours = 'Ingresa una cantidad válida de horas';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Por favor, describe brevemente qué hiciste';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      week_start: formData.date,
      hours: formData.hours,
      notes: formData.description,
      activity: formData.activity,
    };

    if (isEdit && editingEntry) {
      updateWorkLog({
        id: editingEntry.id,
        worklogData: payload
      }, {
        onSuccess: () => {
          toast({
            title: 'Registro actualizado',
            description: 'Tu registro de horas ha sido actualizado correctamente.',
          });
          onOpenChange(false);
          onSuccess?.();
        },
      });
    } else {
      createWorkLog(payload, {
        onSuccess: () => {
          toast({
            title: 'Horas registradas',
            description: 'Tu registro de horas ha sido enviado correctamente.',
          });
          onOpenChange(false);
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {isEdit ? "Editar Horas" : "Registrar Horas de Voluntariado"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Actualiza tu entrada de horas" : "Registra tu tiempo de voluntariado para aprobación"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha de Inicio de Semana</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Horas Trabajadas</Label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0"
              max="168"
              placeholder="Ej: 4.5"
              className={errors.hours ? "border-destructive" : ""}
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            />
            {errors.hours && (
              <p className="text-sm text-destructive">{errors.hours}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Actividad (Opcional)</Label>
            <Select
              value={formData.activity?.id ? String(formData.activity.id) : 'none'}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  activity: value === 'none' 
                    ? null 
                    : activities.find((a) => String(a.id) === value) ?? null
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una actividad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin actividad específica</SelectItem>
                {activities.map((act) => (
                  <SelectItem key={act.id} value={String(act.id)}>
                    {act.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe qué hiciste durante tu tiempo de voluntariado..."
              className={errors.description ? "border-destructive" : ""}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isPending}
              className="bg-gradient-primary"
            >
              {isPending ? "Registrando..." : (isEdit ? "Actualizar Horas" : "Registrar Horas")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

