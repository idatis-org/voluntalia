import { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus, Users, Send, User, X } from "lucide-react";
import { useUsers } from "@/hooks/user/useUsers";
import { useNotifications } from "@/hooks/notification/useNotifications";
import { useSendNotification } from "@/hooks/notification/useSendNotification";
import { useMarkNotificationRead } from "@/hooks/notification/useMarkNotificationRead";

const Notifications = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: users = [] } = useUsers();
  const sendNotification = useSendNotification();
  const markAsRead = useMarkNotificationRead();
  const { toast } = useToast();

  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    message: "",
    recipient: "everyone" as "everyone" | "specific",
    selectedUsers: [] as string[],
  });

  // Filtrar usuarios basado en la búsqueda y excluir los ya seleccionados
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return [];
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) &&
        !newNotification.selectedUsers.includes(user.id)
    );
  }, [userSearchQuery, users, newNotification.selectedUsers]);

  const selectedUserObjects = useMemo(() => {
    return users.filter((user) => newNotification.selectedUsers.includes(user.id));
  }, [users, newNotification.selectedUsers]);

  const handleSelectUser = (userId: string) => {
    setNewNotification((prev) => ({
      ...prev,
      selectedUsers: [...prev.selectedUsers, userId],
    }));
    setUserSearchQuery("");
    setShowUserDropdown(false);
  };

  const handleRemoveUser = (userId: string) => {
    setNewNotification((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter((id) => id !== userId),
    }));
  };

  const closeModal = () => {
    setIsCreateDialogOpen(false);
    setNewNotification({ message: "", recipient: "everyone", selectedUsers: [] });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const handleCreateNotification = async () => {
    if (!newNotification.message.trim()) {
      toast({ title: "Error", description: "Please write a message.", variant: "destructive" });
      return;
    }

    if (newNotification.recipient === "specific" && newNotification.selectedUsers.length === 0) {
      toast({ title: "Error", description: "Please select at least one recipient.", variant: "destructive" });
      return;
    }

    try {
      if (newNotification.recipient === "everyone") {
        await sendNotification.mutateAsync({ message: newNotification.message });
      } else {
        // El backend solo admite un destinatario por envío, así que se manda una petición por usuario seleccionado.
        await Promise.all(
          newNotification.selectedUsers.map((receiverId) =>
            sendNotification.mutateAsync({ message: newNotification.message, receiverId })
          )
        );
      }

      toast({ title: "Success", description: "Notification sent successfully!" });
      closeModal();
    } catch {
      toast({ title: "Error", description: "Failed to send notification.", variant: "destructive" });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipients</Label>
                  <Select
                    value={newNotification.recipient}
                    onValueChange={(value) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        recipient: value as "everyone" | "specific",
                        selectedUsers: value === "everyone" ? [] : prev.selectedUsers,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">All volunteers</SelectItem>
                      <SelectItem value="specific">Specific Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newNotification.recipient === "specific" && (
                  <div className="space-y-3">
                    <Label>Select Users</Label>

                    <div className="relative">
                      <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <User className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                        <Input
                          placeholder="Search users by name..."
                          value={userSearchQuery}
                          onChange={(e) => {
                            setUserSearchQuery(e.target.value);
                            setShowUserDropdown(true);
                          }}
                          onFocus={() => setShowUserDropdown(true)}
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>

                      {showUserDropdown && filteredUsers.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-auto">
                          {filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleSelectUser(user.id)}
                              className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                            >
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm">{user.name}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {showUserDropdown && userSearchQuery && filteredUsers.length === 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg p-3 text-sm text-muted-foreground">
                          No users found
                        </div>
                      )}
                    </div>

                    {selectedUserObjects.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedUserObjects.map((user) => (
                          <Badge key={user.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                            <span>{user.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveUser(user.id)}
                              className="ml-1 hover:bg-muted rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {selectedUserObjects.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Select at least one user to continue
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNotification} disabled={sendNotification.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">Cargando notificaciones...</p>
              </CardContent>
            </Card>
          ) : notifications.length === 0 ? (
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
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all ${!notification.isRead ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <CardHeader onClick={() => !notification.isRead && markAsRead.mutate(notification.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Bell className="h-4 w-4 text-blue-600 mt-1" />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                          <CardDescription>{notification.message}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>From: {notification.senderName}</span>
                          </span>
                          <span>•</span>
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
