import type { Project } from '@/types/project';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDeleteProjectProps {
  open: boolean;
  project: Project | null;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * AlertDialog para confirmar eliminación de proyecto
 * Muestra un mensaje de advertencia clara y dos opciones
 */
export const ConfirmDeleteProject = ({
  open,
  project,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteProjectProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar Proyecto</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar el proyecto{' '}
            <span className="font-semibold text-foreground">
              "{project?.name}"
            </span>
            ?
            <div className="mt-4 p-3 bg-destructive/10 rounded-md">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Esta acción no se puede deshacer. Se eliminarán todas las
                asignaciones de voluntarios asociadas.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
