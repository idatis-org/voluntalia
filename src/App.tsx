import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Volunteers from './pages/Volunteers';
import Activities from './pages/Activities';
import Events from './pages/Events';
import Hours from './pages/Hours';
import Resources from './pages/Resources';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import FAQWidget from './components/FAQWidget';
import { ROUTE_PERMISSIONS } from './config/permissions';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Rutas protegidas */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/profile" element={<Profile />} />
                        {/* Rutas protegidas por rol */}
                        <Route
                          path="/volunteers"
                          element={
                            <ProtectedRoute
                              allowedRoles={ROUTE_PERMISSIONS.VOLUNTEERS}
                            >
                              <Volunteers />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/activities"
                          element={
                            <ProtectedRoute
                              allowedRoles={ROUTE_PERMISSIONS.ACTIVITIES}
                            >
                              <Activities />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/hours"
                          element={
                            <ProtectedRoute
                              allowedRoles={ROUTE_PERMISSIONS.HOURS}
                            >
                              <Hours />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/resources"
                          element={
                            <ProtectedRoute
                              allowedRoles={ROUTE_PERMISSIONS.RESOURCES}
                            >
                              <Resources />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/notifications"
                          element={
                            <ProtectedRoute
                              allowedRoles={ROUTE_PERMISSIONS.NOTIFICATIONS}
                            >
                              <Notifications />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute
                              allowedRoles={ROUTE_PERMISSIONS.SETTINGS}
                            >
                              <Settings />
                            </ProtectedRoute>
                          }
                        />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <FAQWidget />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
