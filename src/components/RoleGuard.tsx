import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { canAccess, type RoleGroup } from "@/config/rbac";
import { useLocation } from "react-router-dom";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: RoleGroup[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { roleGroup, loading } = useAuth();
  const location = useLocation();

  if (loading || !roleGroup) return null;

  // If specific roles provided, check those
  if (allowedRoles && !allowedRoles.includes(roleGroup)) {
    return <Navigate to="/access-denied" replace />;
  }

  // Otherwise check route-based permissions
  if (!canAccess(roleGroup, location.pathname)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
