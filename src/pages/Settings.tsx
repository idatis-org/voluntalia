import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { usePreferences } from "@/hooks/preferences/usePreferences";
import { useUpdatePreferences } from "@/hooks/preferences/useUpdatePreferences";
import { useToast } from "@/hooks/use-toast";
import { formatPhoneNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Palette, Save, KeyRound } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { data: userData } = useCurrentUser();
  const user = userData?.user;

  const { data: preferences, isLoading: isPreferencesLoading } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    events: true,
    updates: false,
  });

  const [appearance, setAppearance] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
  });

  // Sincroniza el formulario local cuando llegan las preferencias reales del backend
  useEffect(() => {
    if (!preferences) return;
    setNotifications({
      email: preferences.emailNotifications,
      push: preferences.pushNotifications,
      sms: preferences.smsNotifications,
      events: preferences.eventNotifications,
      updates: preferences.updateNotifications,
    });
    setAppearance({
      language: preferences.language,
      timezone: preferences.timezone,
      dateFormat: preferences.dateFormat,
    });
  }, [preferences]);

  const saveNotifications = async () => {
    try {
      await updatePreferences.mutateAsync({
        emailNotifications: notifications.email,
        pushNotifications: notifications.push,
        smsNotifications: notifications.sms,
        eventNotifications: notifications.events,
        updateNotifications: notifications.updates,
      });
      toast({ title: "Preferences saved", description: "Your notification preferences were updated." });
    } catch {
      toast({ title: "Error", description: "Failed to save preferences.", variant: "destructive" });
    }
  };

  const saveAppearance = async () => {
    try {
      await updatePreferences.mutateAsync({
        language: appearance.language,
        timezone: appearance.timezone,
        dateFormat: appearance.dateFormat,
      });
      toast({ title: "Preferences saved", description: "Your appearance preferences were updated." });
    } catch {
      toast({ title: "Error", description: "Failed to save preferences.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal information on file</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" value={user?.name || ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={user?.email || ""} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" value={formatPhoneNumber(user?.phone || "")} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={`${user?.city || ""}, ${user?.country || ""}`} readOnly />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    To update this information, visit your Profile page.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password via a secure reset link sent to your email</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => navigate("/reset-password")}>
                    <KeyRound className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Communication Channels</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important updates via text message</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Content Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="event-notifications" className="text-base">Event Updates</Label>
                        <p className="text-sm text-muted-foreground">Notifications about new events and changes</p>
                      </div>
                      <Switch
                        id="event-notifications"
                        checked={notifications.events}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, events: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="update-notifications" className="text-base">System Updates</Label>
                        <p className="text-sm text-muted-foreground">News about platform updates and features</p>
                      </div>
                      <Switch
                        id="update-notifications"
                        checked={notifications.updates}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, updates: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="bg-gradient-primary hover:shadow-hover transition-smooth"
                  onClick={saveNotifications}
                  disabled={isPreferencesLoading || updatePreferences.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Appearance & Preferences</CardTitle>
                <CardDescription>Customize how the application looks and behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={appearance.language}
                      onValueChange={(value) => setAppearance((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={appearance.timezone}
                      onValueChange={(value) => setAppearance((prev) => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={appearance.dateFormat}
                      onValueChange={(value) => setAppearance((prev) => ({ ...prev, dateFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="bg-gradient-primary hover:shadow-hover transition-smooth"
                  onClick={saveAppearance}
                  disabled={isPreferencesLoading || updatePreferences.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
