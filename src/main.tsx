
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPostHog, posthog } from './lib/posthog';
import { PostHogProvider } from 'posthog-js/react';

initPostHog();

const rootElement = document.getElementById("root");

if (rootElement) {
    createRoot(rootElement).render(
    <React.StrictMode>
      <PostHogProvider client={posthog}>
        <App />
      </PostHogProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
