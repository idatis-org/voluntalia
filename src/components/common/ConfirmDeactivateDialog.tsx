import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDeactivateDialogProps {
  open: boolean;
  volunteerName: string;
  isActive: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDeactivateDialog: React.FC<
  ConfirmDeactivateDialogProps
> = ({ open, volunteerName, isActive, onConfirm, onCancel, isLoading }) => {
  const action = isActive ? 'deactivate' : 'activate';
  const actionCapitalized = isActive ? 'Deactivate' : 'Activate';

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{actionCapitalized} Volunteer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action} <strong>{volunteerName}</strong>?{' '}
            {isActive
              ? 'This user be marked as inactive but their data will be preserved.'
              : 'They will be marked as active and can participate in activities again.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isActive
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-soft-green hover:bg-soft-green/90 text-white'
            }
          >
            {isLoading
              ? `${actionCapitalized.slice(0, -1)}ing...`
              : actionCapitalized}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
