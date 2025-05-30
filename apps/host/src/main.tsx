import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { ClerkProviderWrapper } from '@turbo-with-tailwind-v4/auth';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProviderWrapper>
      <RouterProvider router={router} />
    </ClerkProviderWrapper>
  </React.StrictMode>,
);
