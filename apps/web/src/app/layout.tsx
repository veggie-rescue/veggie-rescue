import type { Metadata } from 'next';
import './globals.scss';
import { Navbar } from '../components/Navbar';

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
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
