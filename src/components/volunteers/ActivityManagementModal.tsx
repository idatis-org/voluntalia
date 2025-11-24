import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Trash2 } from 'lucide-react';
import { User } from '@/types/user';
import { ActivityTask } from '@/types/activity';

interface ActivityManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: User | null;
  activities: ActivityTask[];
  searchActivity: string;
  onSearchActivityChange: (value: string) => void;
  onAssignActivity: (userId: string, activityId: string) => void;
  onRemoveActivity: (userId: string, activityId: string) => void;
}

export const ActivityManagementModal: React.FC<
  ActivityManagementModalProps
> = ({
  isOpen,
  onClose,
  volunteer,
  activities,
  searchActivity,
  onSearchActivityChange,
  onAssignActivity,
  onRemoveActivity,
}) => {
  if (!volunteer) return null;

  const availableActivities = activities.filter(
    (a) =>
      a.title.toLowerCase().includes(searchActivity.toLowerCase()) &&
      !volunteer.volunteerActivities?.some((va) => va.id === a.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activities for {volunteer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {volunteer.volunteerActivities?.length ? (
            volunteer.volunteerActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <Badge variant="secondary" className="text-sm font-medium">
                  {activity.title}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  onClick={() => onRemoveActivity(volunteer.id, activity.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No activities assigned yet.
            </p>
          )}

          <div>
            <Label>Assign new activity</Label>
            <Command className="rounded-lg border shadow-sm">
              <CommandInput
                placeholder="Search activity…"
                value={searchActivity}
                onValueChange={onSearchActivityChange}
              />
              <CommandList>
                <CommandEmpty>No activities found.</CommandEmpty>
                <CommandGroup>
                  {availableActivities.slice(0, 5).map((activity) => (
                    <CommandItem
                      key={activity.id}
                      onSelect={() =>
                        onAssignActivity(volunteer.id, activity.id)
                      }
                    >
                      {activity.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
