import type { Metadata } from 'next';
import './globals.scss';

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
      <body>{children}</body>
    </html>
  );
}
