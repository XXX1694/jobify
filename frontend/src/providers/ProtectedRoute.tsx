import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';

/** Gate for authenticated routes — bounces to /login when no session. */
export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
