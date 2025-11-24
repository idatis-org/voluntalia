import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSkills } from '@/hooks/skill/useSkills';
import { useCreateSkill } from '@/hooks/skill/useCreateSkill';
import { useUpdateSkill } from '@/hooks/skill/useUpdateSkill';
import { useDeleteSkill } from '@/hooks/skill/useDeleteSkill';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Skill } from '@/types/skill';

interface ManageSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageSkillsModal = ({
  open,
  onOpenChange,
}: ManageSkillsModalProps) => {
  const { toast } = useToast();
  const { data: skills = [], isLoading } = useSkills();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();

  const [newSkillName, setNewSkillName] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async () => {
    if (!newSkillName.trim() || alreadyExists) return;

    createMutation.mutate(
      { name: newSkillName.trim() },
      {
        onSuccess: () => {
          toast({ title: 'Skill created successfully' });
          setNewSkillName('');
        },
        onError: () => {
          toast({
            title: 'Error creating skill',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleUpdate = async () => {
    if (!editingSkill || !editName.trim()) return;
    const alreadyExists = skills.some(
      (skill) => skill.name.toLowerCase() === editName.trim().toLowerCase()
    );
    if (alreadyExists) {
      toast({
        title: 'A skill with this name already exists',
      });
      return;
    }
    updateMutation.mutate(
      { id: editingSkill.id, skill: { name: editName.trim() } },
      {
        onSuccess: () => {
          toast({ title: 'Skill updated successfully' });
          setEditingSkill(null);
          setEditName('');
        },
        onError: () => {
          toast({
            title: 'Error updating skill',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: 'Skill deleted successfully' });
      },
      onError: () => {
        toast({
          title: 'Error deleting skill',
          variant: 'destructive',
        });
      },
    });
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setEditName(skill.name);
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setEditName('');
  };

  // Filtramos las skills existentes en base al input
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(newSkillName.toLowerCase())
  );

  // Verificamos si ya existe exactamente esa skill
  const alreadyExists = skills.some(
    (skill) => skill.name.toLowerCase() === newSkillName.trim().toLowerCase()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Skills</DialogTitle>
          <DialogDescription>
            Create, edit, or delete skills for volunteers
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div>Loading skills...</div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter new skill name..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              />
              <Button
                onClick={handleCreate}
                disabled={
                  createMutation.isPending ||
                  !newSkillName.trim() ||
                  alreadyExists
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">All Skills</h4>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No matching skills. You can create this one!
                  </p>
                ) : (
                  filteredSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      {editingSkill?.id === skill.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                            onKeyPress={(e) =>
                              e.key === 'Enter' && handleUpdate()
                            }
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleUpdate}
                            disabled={updateMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge
                            variant="outline"
                            className="text-base px-3 py-1"
                          >
                            {skill.name}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(skill)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(skill.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
