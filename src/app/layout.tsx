'use client';

import './globals.css';
import { MainProvider } from '@/components/provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}
