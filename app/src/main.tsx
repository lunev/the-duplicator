import '@/assets/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App.tsx';
import AppProviders from '@/providers/AppProviders';

// Popup and side panel share this same entry point; manifest.json opens the side panel with
// ?context=sidepanel so index.css can size it differently (see html.side-panel rules).
if (new URLSearchParams(window.location.search).get('context') === 'sidepanel') {
  document.documentElement.classList.add('side-panel');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
