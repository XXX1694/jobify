import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Background } from './Background';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { RouteFallback } from './RouteFallback';
import { CommandPalette } from '@/components/common/CommandPalette';

export function AppShell() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <>
      <Background />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto w-full max-w-[88rem] px-5 py-6 lg:px-8 lg:py-9"
            >
              <Suspense fallback={<RouteFallback />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </main>
          <Footer />
        </div>
      </div>
      <MobileNav />
      <CommandPalette />
    </>
  );
}
