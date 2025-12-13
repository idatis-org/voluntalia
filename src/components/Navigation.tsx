import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Users, Clock, FileText, Menu, LogOut, Bell, Activity, FolderOpen } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { ROUTE_PERMISSIONS, isVolunteer } from "@/config/permissions";
import { canAccessRoute } from "@/lib/permissions";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 para saber la ruta actual
  
  var src_voluntalia_logo = "public/voluntalia_thumbnail_" + localStorage.getItem('theme') + ".png";

  const navItems = useMemo(() => [
    { name: "Dashboard", href: "/", icon: Heart, roles: ROUTE_PERMISSIONS.DASHBOARD },
    { name: "Volunteers", href: "/volunteers", icon: Users, roles: ROUTE_PERMISSIONS.VOLUNTEERS },
    { name: "Activities", href: "/activities", icon: Activity, roles: ROUTE_PERMISSIONS.ACTIVITIES },
    { name: "Projects", href: "/projects", icon: FolderOpen, roles: ROUTE_PERMISSIONS.PROJECTS },
    // { name: "Events", href: "/events", icon: Calendar, roles: [] },
    { name: "Hours", href: "/hours", icon: Clock, roles: ROUTE_PERMISSIONS.HOURS },
    { name: "Resources", href: "/resources", icon: FileText, roles: ROUTE_PERMISSIONS.RESOURCES },
    { name: "Notifications", href: "/notifications", icon: Bell, roles: ROUTE_PERMISSIONS.NOTIFICATIONS },
    // { name: "Settings", href: "/settings", icon: Settings, roles: ROUTE_PERMISSIONS.SETTINGS },
  ], []);

  const allowedNavItems = useMemo(() => navItems.filter(item => 
    canAccessRoute(user, item.roles)
  ), [navItems, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Prevent background scrolling when mobile menu overlay is open
  useEffect(() => {
    if (isOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous || "";
      };
    }
    return;
  }, [isOpen]);

  const openLogoutConfirm = () => setIsConfirmOpen(true);
  const closeLogoutConfirm = () => setIsConfirmOpen(false);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await Promise.resolve();
      handleLogout();
    } finally {
      setIsLoggingOut(false);
      closeLogoutConfirm();
    }
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
              <span className="w-36 h-36 flex items-center space-x-3">
                <img src={src_voluntalia_logo}></img>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 md:space-x-2 lg:space-x-4">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `px-2 md:px-3 py-2 rounded-md text-sm font-medium flex items-center md:space-x-2 transition-smooth ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    aria-label={item.name}
                    title={item.name}
                  >
                    <Icon className="h-4 w-4" />
                    {/* label: hidden at md (compact), visible according to role: VOLUNTEER=lg, COORDINATOR=xl, default=lg */}
                    <span className={`hidden ${isVolunteer(user?.role) ? 'lg:inline' : 'xl:inline'}`}>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Profile & Logout Section (desktop only) */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="shadow-soft"
              onClick={handleProfileClick}
            >
              <Users className="h-4 w-4 mr-2" />
              {/* VOLUNTEER: visible at lg, COORDINATOR: visible at xl, others: visible at lg */}
              <span className={`hidden ${isVolunteer(user?.role) ? 'lg:inline' :  'xl:inline'}`}>Profile</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={openLogoutConfirm}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Logout</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        // Fullscreen overlay for mobile menu
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="relative h-full w-full flex flex-col bg-gradient-soft">
            {/* Header with close button */}
            <div className="border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-semibold text-foreground">VoluntALIA</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable nav items */}
            <div className="overflow-auto px-4 py-4 space-y-2 flex-1">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `px-3 py-3 rounded-md text-base font-medium flex items-center space-x-3 transition-smooth ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Footer: Profile + Logout pinned to bottom */}
            <div className="px-4 py-4 border-t border-border">
              <div className="space-y-2">
                <NavLink
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `w-full flex items-center px-3 py-3 rounded-md text-base font-medium justify-start space-x-3 transition-smooth ${
                    isActive ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  aria-label="Profile"
                  title="Profile"
                >
                  <Users className="h-5 w-5 mr-2" />
                  <span>Profile</span>
                </NavLink>
                <button
                  className="w-full flex items-center px-3 py-3 rounded-md text-base font-medium justify-start space-x-3 text-red-600 hover:text-red-700"
                  onClick={() => {
                    setIsOpen(false);
                    openLogoutConfirm();
                  }}
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={closeLogoutConfirm}
          onConfirm={confirmLogout}
          isLoading={isLoggingOut}
          title="Confirm logout"
          description="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          variant="destructive"
        />
    </nav>
  );
};