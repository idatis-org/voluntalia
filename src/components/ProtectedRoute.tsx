// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  allowedRoles = []  }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene al menos uno de los roles permitidos
  if (allowedRoles.length > 0 && user?.role) {
    const hasPermission = allowedRoles.some(role => user.role.includes(role));
    if (!hasPermission) {
      // Redirigir a una página de acceso denegado o al dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};