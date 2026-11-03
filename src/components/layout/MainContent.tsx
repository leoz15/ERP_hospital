'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export function MainContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <main className={`flex-1 overflow-y-auto ${isHome ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
      {children}
    </main>
  );
}
