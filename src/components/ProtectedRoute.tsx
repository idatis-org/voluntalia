// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasAnyRole } from '@/lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: readonly string[];
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
  if (allowedRoles.length > 0 && !hasAnyRole(user, allowedRoles)) {
    // Redirigir a una página de acceso denegado
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};