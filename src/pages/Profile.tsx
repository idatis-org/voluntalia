import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Award,
  MapPin,
  Phone,
  Mail,
  Edit,
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { formatPhoneNumber } from '@/lib/utils';

const Profile = () => {
  const { data, isLoading, error } = useCurrentUser();
  if (isLoading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Destructure user from data to avoid user.user syntax
  const user = data?.user;
  // REMOVE THIS DATA WHEN INTEGRATING WITH REAL USER DATA IS 100% DONE
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'March 2023',
    totalHours: 127,
    eventsAttended: 15,
    skills: ['Community Outreach', 'Event Planning', 'Teaching', 'Translation'],
    recentActivities: [
      {
        id: 1,
        event: 'Food Drive Coordination',
        date: 'Dec 15, 2024',
        hours: 6,
      },
      {
        id: 2,
        event: 'Community Garden Workshop',
        date: 'Dec 10, 2024',
        hours: 4,
      },
      {
        id: 3,
        event: 'Youth Mentoring Session',
        date: 'Dec 5, 2024',
        hours: 3,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your volunteer information and track your impact
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                    {user?.name}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription>
                  Volunteer since{' '}
                  {new Date(user?.createdAt || Date.now()).getFullYear()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gradient-soft rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {mockUser.totalHours}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Hours
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-soft rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {mockUser.eventsAttended}
                    </div>
                    <div className="text-sm text-muted-foreground">Events</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formatPhoneNumber(user?.phone || '')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{`${user?.city || ''}, ${user?.country || ''}`}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your personal details
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Name</Label>
                        <Input
                          id="firstName"
                          value={user?.name || ''}
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email || ''} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formatPhoneNumber(user?.phone || '')}
                          readOnly
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest volunteer contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockUser.recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 bg-gradient-soft rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Award className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{activity.event}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{activity.date}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{activity.hours}h</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills">
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Skills & Interests</CardTitle>
                        <CardDescription>
                          Your volunteer skills and areas of interest
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Skills
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mockUser.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
