'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  const isAccessPage = pathname === '/';

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated && !isAccessPage) {
      router.replace('/');
      return;
    }

    if (isAuthenticated && isAccessPage) {
      router.replace('/dashboard');
    }
  }, [isAccessPage, isAuthenticated, isHydrated, pathname, router]);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated && !isAccessPage) {
    return null;
  }

  if (isAuthenticated && isAccessPage) {
    return null;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {!isAccessPage && <Navbar />}
      {children}
    </>
  );
}
