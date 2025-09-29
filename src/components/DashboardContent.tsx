import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users, ArrowRight, CheckCircle } from "lucide-react";

export const DashboardContent = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Community Food Drive",
      date: "Tomorrow, 9:00 AM",
      location: "Central Community Center",
      volunteers: 12,
      status: "open"
    },
    {
      id: 2,
      title: "Park Cleanup Initiative", 
      date: "This Saturday, 8:00 AM",
      location: "Riverside Park",
      volunteers: 8,
      status: "open"
    },
    {
      id: 3,
      title: "Senior Center Visit",
      date: "Next Monday, 2:00 PM", 
      location: "Sunset Senior Living",
      volunteers: 6,
      status: "full"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Completed",
      event: "Library Book Sorting",
      time: "2 hours ago",
      hours: 4
    },
    {
      id: 2,
      action: "Joined",
      event: "Community Garden Project",
      time: "1 day ago",
      hours: 0
    },
    {
      id: 3,
      action: "Completed",
      event: "Youth Mentoring Session",
      time: "3 days ago", 
      hours: 2
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Events */}
        <Card className="shadow-card hover:shadow-hover transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-soft-blue" />
              <span>Upcoming Events</span>
            </CardTitle>
            <CardDescription>
              Events you can join to make an impact in your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 bg-gradient-soft rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-foreground">{event.title}</h4>
                  <Badge variant={event.status === 'full' ? 'destructive' : 'secondary'}>
                    {event.status === 'full' ? 'Full' : 'Open'}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{event.volunteers} volunteers signed up</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    disabled={event.status === 'full'}
                    className="bg-gradient-primary hover:shadow-soft transition-smooth"
                  >
                    {event.status === 'full' ? 'Event Full' : 'Join Event'}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card hover:shadow-hover transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-soft-green" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Your latest volunteer contributions and engagements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 bg-gradient-soft rounded-lg border border-border">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={activity.action === 'Completed' ? 'default' : 'secondary'}>
                        {activity.action}
                      </Badge>
                      <span className="font-medium text-foreground">{activity.event}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.hours > 0 && (
                    <div className="text-right">
                      <p className="text-lg font-bold text-soft-green">+{activity.hours}h</p>
                      <p className="text-xs text-muted-foreground">volunteer hours</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Quick Actions */}
            <div className="pt-4 border-t border-border">
              <h5 className="font-medium text-foreground mb-3">Quick Actions</h5>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="shadow-soft">
                  View All Events
                </Button>
                <Button variant="outline" size="sm" className="shadow-soft">
                  My Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};