import { useState, useMemo } from 'react';
import type { Project } from '@/types/project';
import { useUsers } from '@/hooks/user/useUsers';
import { useAddVolunteerToProject } from '@/hooks/project/useAddVolunteerToProject';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Users } from 'lucide-react';

interface AddVolunteerModalProps {
  open: boolean;
  project: Project | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog para agregar voluntarios a un proyecto
 * Muestra lista de voluntarios disponibles con checkboxes
 * Solo permite agregar voluntarios no asignados aún
 */
export const AddVolunteerModal = ({
  open,
  project,
  onOpenChange,
}: AddVolunteerModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { mutate: addVolunteer, isPending } = useAddVolunteerToProject();

  // Voluntarios ya asignados al proyecto
  const assignedIds = useMemo(
    () => new Set(project?.volunteers?.map((v) => v.id) || []),
    [project]
  );

  // Filtrar voluntarios disponibles por búsqueda
  const availableUsers = useMemo(() => {
    return users
      .filter((user) => !assignedIds.has(user.id))
      .filter((user) =>
        `${user.name} ${user.email}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
  }, [users, assignedIds, searchTerm]);

  const handleAddVolunteer = (userId: string) => {
    if (!project) return;

    addVolunteer(
      { projectId: project.id, userId },
      {
        onSuccess: () => {
          setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        },
      }
    );
  };

  const handleSubmit = () => {
    if (!project || selectedUsers.length === 0) return;

    // Agregar cada voluntario seleccionado
    selectedUsers.forEach((userId) => {
      handleAddVolunteer(userId);
    });
  };

  const isLoading = usersLoading || isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Agregar Voluntarios a {project?.name}
          </DialogTitle>
        </DialogHeader>

        {/* Búsqueda */}
        <div className="space-y-4">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />

          {/* Lista de voluntarios */}
          <ScrollArea className="h-[300px] border rounded-md p-4">
            {availableUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? 'No hay voluntarios que coincidan'
                    : 'No hay voluntarios disponibles'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-muted"
                  >
                    <Checkbox
                      id={user.id}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.id)
                          );
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={user.id}
                      className="flex-1 cursor-pointer flex flex-col"
                    >
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {selectedUsers.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedUsers.length} voluntario
              {selectedUsers.length !== 1 ? 's' : ''} seleccionado
              {selectedUsers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedUsers.length === 0}
          >
            {isPending ? 'Agregando...' : 'Agregar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
