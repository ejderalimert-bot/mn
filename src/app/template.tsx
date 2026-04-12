"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The template component forces a remount on navigation because its key will change natively, 
  // triggering the "animate-page-enter" CSS animation attached below.
  return (
    <div key={pathname} className="animate-page-enter w-full h-full min-h-screen">
      {children}
    </div>
  );
}
