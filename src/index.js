import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import Timeline from './components/Timeline';
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Timeline /> */}
  </React.StrictMode>
);