import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useTheme } from '@/contexts/ThemeContext';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    events: true,
    updates: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and system settings
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="account"
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="flex items-center space-x-2"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Sarah" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Johnson" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="sarah.johnson@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <Button className="bg-gradient-primary hover:shadow-hover transition-smooth">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <Button variant="outline">Update Password</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Communication Channels
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="email-notifications"
                          className="text-base"
                        >
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            email: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="push-notifications"
                          className="text-base"
                        >
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            push: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="sms-notifications"
                          className="text-base"
                        >
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via text message
                        </p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={notifications.sms}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            sms: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Content Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="event-notifications"
                          className="text-base"
                        >
                          Event Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about new events and changes
                        </p>
                      </div>
                      <Switch
                        id="event-notifications"
                        checked={notifications.events}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            events: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="update-notifications"
                          className="text-base"
                        >
                          System Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          News about platform updates and features
                        </p>
                      </div>
                      <Switch
                        id="update-notifications"
                        checked={notifications.updates}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            updates: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button className="bg-gradient-primary hover:shadow-hover transition-smooth">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to other volunteers
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Activity Tracking</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow tracking of volunteer hours and activities
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">
                          Contact Information Sharing
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Share contact info with event organizers
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Manage your personal data and account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-soft rounded-lg">
                    <div>
                      <p className="font-medium">Download Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Get a copy of your volunteer data
                      </p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-soft rounded-lg">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and data
                      </p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Appearance & Preferences</CardTitle>
                <CardDescription>
                  Customize how the application looks and behaves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={theme}
                      onValueChange={(value) =>
                        setTheme(value as 'light' | 'dark' | 'system')
                      }
                    >
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
                      value={preferences.language}
                      onValueChange={(value) =>
                        setPreferences((prev) => ({ ...prev, language: value }))
                      }
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
                      value={preferences.timezone}
                      onValueChange={(value) =>
                        setPreferences((prev) => ({ ...prev, timezone: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) =>
                        setPreferences((prev) => ({
                          ...prev,
                          dateFormat: value,
                        }))
                      }
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

                <Button className="bg-gradient-primary hover:shadow-hover transition-smooth">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    View system status and configuration details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-soft rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          System Status
                        </span>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Operational
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-soft rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Last Backup</span>
                        <span className="text-sm text-muted-foreground">
                          2 hours ago
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-soft rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Version</span>
                        <span className="text-sm text-muted-foreground">
                          v2.1.0
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-soft rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Storage Used
                        </span>
                        <span className="text-sm text-muted-foreground">
                          2.3 GB / 10 GB
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                  <CardDescription>
                    Perform system maintenance and administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-soft rounded-lg">
                    <div>
                      <p className="font-medium">Export System Logs</p>
                      <p className="text-sm text-muted-foreground">
                        Download system logs for troubleshooting
                      </p>
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-soft rounded-lg">
                    <div>
                      <p className="font-medium">Clear Cache</p>
                      <p className="text-sm text-muted-foreground">
                        Clear system cache to improve performance
                      </p>
                    </div>
                    <Button variant="outline">Clear</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-soft rounded-lg">
                    <div>
                      <p className="font-medium">Run Diagnostics</p>
                      <p className="text-sm text-muted-foreground">
                        Check system health and performance
                      </p>
                    </div>
                    <Button variant="outline">Run</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
