import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AUTH_EXPIRED_EVENT } from '@/api/client';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ProtectedRoute } from '@/providers/ProtectedRoute';
import { AppShell } from '@/components/layout/AppShell';
import { SplashScreen } from '@/components/layout/SplashScreen';

const AuthPage = lazy(() => import('@/features/auth/AuthPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const JobsPage = lazy(() => import('@/features/jobs/JobsPage'));
const JobDetailPage = lazy(() => import('@/features/jobs/JobDetailPage'));
const ApplicationsPage = lazy(
  () => import('@/features/applications/ApplicationsPage'),
);
const SavedJobsPage = lazy(() => import('@/features/saved/SavedJobsPage'));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage'));
const NotFoundPage = lazy(() => import('@/features/NotFoundPage'));

export default function App() {
  const status = useAuthStore((state) => state.status);
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const expireSession = useAuthStore((state) => state.expireSession);
  const navigate = useNavigate();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const handleExpired = () => {
      expireSession();
      toast.error('Session expired', { description: 'Please sign in again.' });
      navigate('/login', { replace: true });
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, [expireSession, navigate]);

  if (status === 'loading') {
    return <SplashScreen />;
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="saved" element={<SavedJobsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
