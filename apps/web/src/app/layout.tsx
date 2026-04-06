import type { Metadata } from 'next';
import './globals.scss';
import Providers from './providers';
import { AppShell } from '@/components/AppShell/AppShell';

export const metadata: Metadata = {
  title: 'Veggie Rescue',
  description: 'Rescuing vegetables, reducing waste',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
