import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '@/lib/posthog';

/**
 * Tracks SPA pageviews exactly once per route change.
 * Avoids duplicate $pageview events from PostHog's built-in auto-capture
 * (which we disabled in init).
 */
const PostHogTracker = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (lastPath.current === path) return;
    lastPath.current = path;
    posthog.capture('$pageview', { $current_url: window.location.href });
  }, [location]);

  return null;
};

export default PostHogTracker;
