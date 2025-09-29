import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Volunteers from "./pages/Volunteers";
import Activities from "./pages/Activities";
import Events from "./pages/Events";
import Hours from "./pages/Hours";
import Resources from "./pages/Resources";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import FAQWidget from "./components/FAQWidget";

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
            {/* Rutas protegidas */}
            <Route path="/*" element={
              <ProtectedRoute>
                <>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* <Route path="/volunteers" element={<Volunteers />} /> */}
                    {/* Rutas solo para administradores */}
                    <Route path="/volunteers" element={ <Volunteers />
                      // <ProtectedRoute allowedRoles={['COORDINATOR']}>
                      //   <Volunteers />
                      // </ProtectedRoute>
                    } />
                    <Route path="/activities" element={ 
                      <ProtectedRoute allowedRoles={['COORDINATOR']}>
                        <Activities />
                      </ProtectedRoute>
                    } />
                    {/* <Route path="/events" element={<Events />} /> */}
                    <Route path="/hours" element={<Hours />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <FAQWidget />
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
</ThemeProvider>
);

export default App;
