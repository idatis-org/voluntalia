import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateEventModal from '@/components/modals/CreateEventModal';
import { useToast } from '@/hooks/use-toast';

const Events = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Community Food Drive',
      description:
        'Help distribute food to families in need during the holiday season',
      date: '2024-12-28',
      time: '9:00 AM - 2:00 PM',
      location: 'Community Center, 123 Main St',
      volunteers: 12,
      maxVolunteers: 20,
      category: 'community',
      status: 'upcoming',
      organizer: 'Sarah Johnson',
    },
    {
      id: 2,
      title: 'Youth Education Workshop',
      description: 'Teaching basic computer skills to underprivileged youth',
      date: '2024-12-30',
      time: '1:00 PM - 4:00 PM',
      location: 'Public Library, 456 Oak Ave',
      volunteers: 8,
      maxVolunteers: 15,
      category: 'education',
      status: 'upcoming',
      organizer: 'Michael Chen',
    },
    {
      id: 3,
      title: 'Senior Care Visit',
      description:
        'Spend time with elderly residents and assist with daily activities',
      date: '2025-01-02',
      time: '10:00 AM - 3:00 PM',
      location: 'Sunset Care Home, 789 Pine Rd',
      volunteers: 15,
      maxVolunteers: 15,
      category: 'healthcare',
      status: 'full',
      organizer: 'Lisa Thompson',
    },
    {
      id: 4,
      title: 'Environmental Cleanup',
      description: 'Help clean up the local park and plant new trees',
      date: '2025-01-05',
      time: '8:00 AM - 12:00 PM',
      location: 'Central Park, East Entrance',
      volunteers: 5,
      maxVolunteers: 25,
      category: 'environment',
      status: 'upcoming',
      organizer: 'Emma Rodriguez',
    },
    {
      id: 5,
      title: 'Holiday Meal Service',
      description: 'Served meals to 200+ community members',
      date: '2024-12-25',
      time: '11:00 AM - 3:00 PM',
      location: 'Community Kitchen, 321 Elm St',
      volunteers: 18,
      maxVolunteers: 20,
      category: 'community',
      status: 'completed',
      organizer: 'David Park',
    },
  ]);

  const handleCreateEvent = (newEvent: any) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleJoinEvent = (eventId: number) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              volunteers: event.volunteers + 1,
              status:
                event.volunteers + 1 >= event.maxVolunteers
                  ? 'full'
                  : event.status,
            }
          : event
      )
    );
    toast({
      title: 'Successfully Registered',
      description: 'You have been registered for this event.',
    });
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    toast({
      title: 'Event Deleted',
      description: 'The event has been successfully removed.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'default';
      case 'full':
        return 'destructive';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'community':
        return 'bg-blue-100 text-blue-800';
      case 'education':
        return 'bg-green-100 text-green-800';
      case 'healthcare':
        return 'bg-red-100 text-red-800';
      case 'environment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterEvents = (status: string) => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterBy === 'all' || event.category === filterBy;
      const matchesStatus = status === 'all' || event.status === status;

      return matchesSearch && matchesFilter && matchesStatus;
    });
  };

  const upcomingEvents = filterEvents('upcoming');
  const completedEvents = filterEvents('completed');
  const allEvents = filterEvents('all');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-2">
            Manage volunteer events and track participation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">23</p>
                  <p className="text-sm text-muted-foreground">Active Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-soft-green" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-sm text-muted-foreground">
                    Total Participants
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-warm-accent" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-destructive" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">67</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setCreateEventOpen(true)}
                className="bg-gradient-primary hover:shadow-hover transition-smooth"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="upcoming"
              className="flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>Upcoming ({upcomingEvents.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Completed ({completedEvents.length})</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>All Events ({allEvents.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="shadow-card hover:shadow-hover transition-smooth"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="mb-3">
                          {event.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getCategoryColor(event.category)}
                        >
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.volunteers}/{event.maxVolunteers} volunteers
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-muted-foreground">
                          Organized by {event.organizer}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleJoinEvent(event.id)}
                            disabled={event.status === 'full'}
                          >
                            {event.status === 'full' ? 'Full' : 'Join Event'}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Manage Participants
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedEvents.map((event) => (
                <Card key={event.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="mb-3">
                          {event.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="secondary">completed</Badge>
                        <Badge
                          variant="outline"
                          className={getCategoryColor(event.category)}
                        >
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.volunteers} volunteers participated</span>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-muted-foreground">
                          Organized by {event.organizer}
                        </span>
                        <Button variant="outline" size="sm">
                          View Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allEvents.map((event) => (
                <Card
                  key={event.id}
                  className="shadow-card hover:shadow-hover transition-smooth"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="mb-3">
                          {event.description}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getCategoryColor(event.category)}
                        >
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.status === 'completed'
                            ? `${event.volunteers} volunteers participated`
                            : `${event.volunteers}/${event.maxVolunteers} volunteers`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-sm text-muted-foreground">
                          Organized by {event.organizer}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            {event.status === 'completed'
                              ? 'View Report'
                              : 'View Details'}
                          </Button>
                          {event.status !== 'completed' && (
                            <Button
                              size="sm"
                              disabled={event.status === 'full'}
                            >
                              {event.status === 'full' ? 'Full' : 'Join Event'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <CreateEventModal
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onCreate={handleCreateEvent}
      />
    </div>
  );
};

export default Events;
