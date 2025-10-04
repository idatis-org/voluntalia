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
  //const [isLoading, setIsLoading] = useState(false);
  const { mutate, isPending, error } = useCreateUser();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   //setIsLoading(true);

  //   try {
  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 1500));

  //     const newVolunteer = {
  //       ...formData,
  //       name: `${formData.firstName} ${formData.lastName}`,
  //       skills,
  //       id: Date.now(),
  //       status: "active",
  //       joinDate: new Date().toLocaleDateString(),
  //       hours: 0,
  //       events: 0
  //     };

  //     onAdd?.(newVolunteer);
  //     toast({
  //       title: "Volunteer Added Successfully",
  //       description: `${newVolunteer.name} has been added to the volunteer database.`,
  //     });
  //     onOpenChange(false);
  //     resetForm();
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to add volunteer. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
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
    setSkills([]);
    setNewSkill("");
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
              <Label>Add Skills</Label>
              <div className="flex space-x-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
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
