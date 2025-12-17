import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
// import Timeline from './components/Timeline';

// Note: CSS optimization is handled by webpack and nginx configuration
// The main CSS file is small (3.6 KiB) and blocking is acceptable for FCP
// Preconnect hints in HTML help reduce connection time

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
    {/* <Timeline /> */}
  </React.StrictMode>
);