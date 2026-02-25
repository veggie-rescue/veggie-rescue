import type { Metadata } from 'next';
import './globals.scss';
import { Navbar } from '../components/Navbar';
import Providers from './providers';

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
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
