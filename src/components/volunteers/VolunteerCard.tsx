import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { User } from '@/types/user';
import formatDate from '@/lib/formatDate';
import { cn } from '@/lib/utils';

interface VolunteerCardProps {
  volunteer: User;
  onViewProfile: (volunteer: User) => void;
  onEditVolunteerProfile: (volunteer: User) => void;
  onManageActivities: (volunteer: User) => void;
  onContact: (volunteer: User, method: 'email' | 'phone') => void;
  onDelete: (volunteerId: string) => void;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  onViewProfile,
  onEditVolunteerProfile,
  onManageActivities,
  onContact,
  onDelete,
}) => {
  return (
    <Card className="shadow-card hover:shadow-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
              {volunteer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{volunteer.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {volunteer.email}
            </CardDescription>
            <Badge
              variant="secondary"
              className={cn(
                'mt-1',
                volunteer.isActive
                  ? 'bg-soft-green/10 text-soft-green border-soft-green/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              )}
            >
              {volunteer.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onContact(volunteer, 'email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onContact(volunteer, 'phone')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onEditVolunteerProfile(volunteer)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(volunteer.id)}
                  className={cn(
                    volunteer.isActive
                      ? 'text-destructive focus:text-destructive'
                      : 'text-soft-green focus:text-soft-green'
                  )}
                >
                  {volunteer.isActive ? (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-medium capitalize">
              {volunteer.role || 'VOLUNTEER'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Joined:</span>
            <span className="font-medium">
              {formatDate(volunteer.createdAt)}
            </span>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewProfile(volunteer)}
            >
              View Profile
            </Button>
            <Button onClick={() => onManageActivities(volunteer)}>
              <Activity className="h-4 w-4 mr-2" />
              Activities
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
