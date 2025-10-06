import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Users, Calendar, Clock, FileText, Settings, Menu, LogOut, Bell, Activity } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PERMISSIONS } from "@/config/permissions";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 para saber la ruta actual
  

  const navItems = [
    { name: "Dashboard", href: "/", icon: Heart, roles: ROUTE_PERMISSIONS.DASHBOARD },
    { name: "Volunteers", href: "/volunteers", icon: Users, roles: ROUTE_PERMISSIONS.VOLUNTEERS },
    { name: "Activities", href: "/activities", icon: Activity, roles: ROUTE_PERMISSIONS.ACTIVITIES },
    // { name: "Events", href: "/events", icon: Calendar, roles: [] },
    { name: "Hours", href: "/hours", icon: Clock, roles: ROUTE_PERMISSIONS.HOURS },
    { name: "Resources", href: "/resources", icon: FileText, roles: ROUTE_PERMISSIONS.RESOURCES },
    { name: "Notifications", href: "/notifications", icon: Bell, roles: ROUTE_PERMISSIONS.NOTIFICATIONS },
    // { name: "Settings", href: "/settings", icon: Settings, roles: ROUTE_PERMISSIONS.SETTINGS },
  ];

  const allowedNavItems = navItems.filter(item => 
    item.roles.some(role => user?.role.includes(role))
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <nav className="bg-card shadow-soft border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">VoluntALIA</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-smooth ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Profile & Logout Section */}
          <div className="md:block flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="shadow-soft"
              onClick={handleProfileClick}
            >
              <Users className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-soft border-t border-border">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-smooth ${
                    isActive
                      ? "bg-gradient-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};