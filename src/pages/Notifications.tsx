import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Users, Globe, AlertCircle, Info, CheckCircle, Clock, Send, Calendar } from "lucide-react";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    title: "System Update Scheduled",
    message: "The system will be updated tonight from 2:00 AM to 4:00 AM. Some features may be temporarily unavailable.",
    type: "info",
    recipient: "everyone",
    sender: "System Admin",
    createdAt: "2024-01-15T10:30:00Z",
    read: false
  },
  {
    id: 2,
    title: "New Event: Community Cleanup",
    message: "Join us for a community cleanup event this Saturday at Central Park. Volunteers needed!",
    type: "event",
    recipient: "everyone",
    sender: "Maria Garcia",
    createdAt: "2024-01-14T15:45:00Z",
    read: true
  },
  {
    id: 3,
    title: "Hours Approval Required",
    message: "Your submitted hours for last week are pending approval. Please check with your coordinator.",
    type: "warning",
    recipient: "specific",
    recipientUsers: ["John Doe"],
    sender: "Hours System",
    createdAt: "2024-01-13T09:15:00Z",
    read: false
  },
  {
    id: 4,
    title: "Welcome to VoluntALIA!",
    message: "Welcome to our volunteer management system. Please complete your profile setup.",
    type: "success",
    recipient: "specific",
    recipientUsers: ["New Volunteer"],
    sender: "System",
    createdAt: "2024-01-12T14:20:00Z",
    read: true
  }
];

// Mock users for recipient selection
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Maria Garcia", email: "maria@example.com" },
  { id: 4, name: "David Johnson", email: "david@example.com" }
];

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success" | "event",
    recipient: "everyone" as "everyone" | "specific",
    selectedUsers: [] as number[]
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "event": return <Calendar className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "warning": return <Badge variant="destructive">Warning</Badge>;
      case "success": return <Badge variant="default" className="bg-green-600">Success</Badge>;
      case "event": return <Badge variant="secondary">Event</Badge>;
      default: return <Badge variant="outline">Info</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (newNotification.recipient === "specific" && newNotification.selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one recipient.",
        variant: "destructive"
      });
      return;
    }

    const notification = {
      id: Date.now(),
      ...newNotification,
      sender: "Current User", // In real app, this would be the authenticated user
      createdAt: new Date().toISOString(),
      read: false,
      recipientUsers: newNotification.recipient === "specific" 
        ? newNotification.selectedUsers.map(id => mockUsers.find(u => u.id === id)?.name || "")
        : undefined
    };

    setNotifications(prev => [notification, ...prev]);
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      recipient: "everyone",
      selectedUsers: []
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: "Notification sent successfully!",
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const generalNotifications = notifications.filter(n => n.recipient === "everyone");
  const personalNotifications = notifications.filter(n => n.recipient === "specific");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all notifications ({unreadCount} unread)
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-soft">
                <Plus className="h-4 w-4 mr-2" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to users in the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipients</Label>
                  <Select 
                    value={newNotification.recipient} 
                    onValueChange={(value) => setNewNotification(prev => ({ 
                      ...prev, 
                      recipient: value as any,
                      selectedUsers: value === "everyone" ? [] : prev.selectedUsers
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="specific">Specific Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {newNotification.recipient === "specific" && (
                  <div className="space-y-2">
                    <Label>Select Users</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {mockUsers.map(user => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            checked={newNotification.selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewNotification(prev => ({
                                  ...prev,
                                  selectedUsers: [...prev.selectedUsers, user.id]
                                }));
                              } else {
                                setNewNotification(prev => ({
                                  ...prev,
                                  selectedUsers: prev.selectedUsers.filter(id => id !== user.id)
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`user-${user.id}`} className="text-sm">
                            {user.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNotification}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              General ({generalNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="personal">
              <Users className="h-4 w-4 mr-2" />
              Personal ({personalNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`cursor-pointer transition-all ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}>
                  <CardHeader onClick={() => markAsRead(notification.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                            {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                          </div>
                          <CardDescription>{notification.message}</CardDescription>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>From: {notification.sender}</span>
                            <span>•</span>
                            <span>{formatDate(notification.createdAt)}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              {notification.recipient === "everyone" ? (
                                <>
                                  <Globe className="h-3 w-3" />
                                  <span>Everyone</span>
                                </>
                              ) : (
                                <>
                                  <Users className="h-3 w-3" />
                                  <span>Specific users</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getNotificationBadge(notification.type)}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            {generalNotifications.map((notification) => (
              <Card key={notification.id} className={`cursor-pointer transition-all ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}>
                <CardHeader onClick={() => markAsRead(notification.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        <CardDescription>{notification.message}</CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>From: {notification.sender}</span>
                          <span>•</span>
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getNotificationBadge(notification.type)}
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            {personalNotifications.map((notification) => (
              <Card key={notification.id} className={`cursor-pointer transition-all ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}>
                <CardHeader onClick={() => markAsRead(notification.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        <CardDescription>{notification.message}</CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>From: {notification.sender}</span>
                          <span>•</span>
                          <span>{formatDate(notification.createdAt)}</span>
                          {notification.recipientUsers && (
                            <>
                              <span>•</span>
                              <span>To: {notification.recipientUsers.join(", ")}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getNotificationBadge(notification.type)}
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;