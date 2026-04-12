"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsProvider() {
  const pathname = usePathname();

  // Handle Pageview Tracker
  useEffect(() => {
    if (pathname && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname })
      }).catch(() => {});
    }
  }, [pathname]);

  // Handle Heartbeat (Active User Tracker)
  useEffect(() => {
    let sessionId = localStorage.getItem('site_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('site_session_id', sessionId);
    }

    const sendHeartbeat = () => {
      fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      }).catch(() => {});
    };

    sendHeartbeat(); // initial
    const interval = setInterval(sendHeartbeat, 15000); // 15 seconds heartbeat
    return () => clearInterval(interval);
  }, []);

  return null;
}
