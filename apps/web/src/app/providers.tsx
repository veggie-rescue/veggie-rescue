"use client";

import { AuthProvider } from '@/context/AuthContext';
import { TableDataProvider } from '@/context/TableDataContext';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <TableDataProvider>{children}</TableDataProvider>
    </AuthProvider>
  );
}
