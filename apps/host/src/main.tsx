import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
//import './index.css';

// Add global error handler for better debugging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
          <RouterProvider router={router} />
  </React.StrictMode>,
);
