import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_DiToc2J4dXeSuptFzvGTB3VYcs5wXNjzfSSfThzbVUfk';
const POSTHOG_HOST = 'https://us.i.posthog.com';

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === 'undefined') return;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // we capture manually on route change to avoid duplicates
    capture_pageleave: true,
    person_profiles: 'identified_only',
    autocapture: false, // we explicitly track key events to avoid duplicate noise
    loaded: () => {
      initialized = true;
    },
  });
  initialized = true;
}

export { posthog };
