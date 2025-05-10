'use client';

import { Suspense } from 'react';
import './globals.css';
import { MainProvider } from '@/components/provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense>
          <MainProvider>{children}</MainProvider>
        </Suspense>
      </body>
    </html>
  );
}
