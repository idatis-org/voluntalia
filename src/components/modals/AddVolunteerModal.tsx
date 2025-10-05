import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "@/hooks/user/useCreateUser";
import { CreateUserDTO } from "@/types/user";
import { useSkills } from "@/hooks/skill/useSkills";
import { Checkbox } from "@/components/ui/checkbox";

interface AddVolunteerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (volunteer: unknown) => void;
}

const AddVolunteerModal: React.FC<AddVolunteerModalProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const { toast } = useToast();
  const { mutate, isPending, error } = useCreateUser();
  const { data: allSkills = [] } = useSkills();
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    availability: "",
    motivation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateUserDTO = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: "aaa111",
      country: formData.country,
      city: formData.city,
    };

    mutate(payload, {
      onSuccess: (newVolunteer) => {
        onAdd?.(newVolunteer);
        console.log(newVolunteer);
        toast({
          title: "Volunteer Added Successfully",
          description: `${newVolunteer.name} ${newVolunteer.email} has been added.`,
        });
        onOpenChange(false);
        resetForm();
      },
      onError: (err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to add volunteer. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleToggleSkill = (skillId: string) => {
    const newSelected = new Set(selectedSkills);
    if (newSelected.has(skillId)) {
      newSelected.delete(skillId);
    } else {
      newSelected.add(skillId);
    }
    setSelectedSkills(newSelected);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      emergency_contact: "",
      emergency_phone: "",
      availability: "",
      motivation: "",
    });
    setSelectedSkills(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Volunteer</DialogTitle>
          <DialogDescription>
            Add a new volunteer to the VoluntALIA community. Fill out their
            information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_phone"
                  value={formData.emergency_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skills & Interests</h3>
            <div className="space-y-2">
               <Label>Select Skills</Label>
              {allSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skills available. Contact an administrator to add skills.
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                  {allSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill.id}`}
                        checked={selectedSkills.has(skill.id)}
                        onCheckedChange={() => handleToggleSkill(skill.id)}
                      />
                      <label
                        htmlFor={`skill-${skill.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {skill.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {selectedSkills.size > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {allSkills
                    .filter(s => selectedSkills.has(s.id))
                    .map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="evenings">Evenings</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivation">Why do you want to volunteer?</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) =>
                  setFormData({ ...formData, motivation: e.target.value })
                }
                placeholder="Tell us about your motivation to volunteer..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gradient-primary"
            >
              {isPending ? "Adding..." : "Add Volunteer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVolunteerModal;
