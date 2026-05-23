import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';

/**
 * Gate for admin-only routes. Nested inside ProtectedRoute, so the session is
 * already resolved here — an authenticated developer is bounced to the dashboard.
 */
export function AdminRoute() {
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
